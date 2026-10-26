/**
 * =======================================================================
 * WEB FORM UPDATE PROGRES SPONSORSHIP - GOOGLE APPS SCRIPT
 * Terhubung langsung secara realtime dengan Google Sheets
 * =======================================================================
 */

// PENTING:
// 1. Jika script ini dibuat dari menu 'Extensions > Apps Script' di Google Sheet, biarkan kosong ''.
// 2. Jika Anda membuat script standalone (di script.google.com), masukkan ID Spreadsheet Anda di bawah:
//    Contoh: const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
const SPREADSHEET_ID = '';

const SHEET_NAME = 'Progres_Sponsor';

/**
 * Mendapatkan Spreadsheet aktif atau via ID
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error("Spreadsheet tidak ditemukan! Pastikan Anda membukanya dari Google Sheets (Extensions > Apps Script) atau isi SPREADSHEET_ID di Code.gs.");
}

/**
 * Handle HTTP GET - Menampilkan Web App Form atau mengembalikan data JSON API
 */
function doGet(e) {
  // Jika dipanggil dari Vercel / Website luar untuk ambil data
  if (e && e.parameter && e.parameter.action === 'getData') {
    const data = getDashboardData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Update Progres Sponsor')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Handle HTTP POST - Menerima kiriman data dari Vercel / Website luar
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    let result;
    if (payload.action === 'updateStatus') {
      result = updateStatusSponsor(payload.rowNumber, payload.statusBaru, payload.keteranganBaru);
    } else {
      result = simpanDataProgres(payload);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Gagal memproses di server: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Memastikan sheet dan header sudah siap dengan styling yang rapi
 */
function getOrCreateSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'Waktu Input (Timestamp)',
      'Tanggal Pengajuan',
      'Nama PJ',
      'Nama Perusahaan',
      'Narahubung',
      'Via Kontak',
      'Benefit',
      'Status Progres',
      'Keterangan Progres'
    ];
    sheet.appendRow(headers);
    
    // Format Header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0F172A'); // Slate 900
    headerRange.setFontColor('#F8FAFC'); // White slate
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setWrap(true);
    sheet.setRowHeight(1, 40);
    sheet.setFrozenRows(1);
    
    // Set column widths
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 130); // Tanggal Pengajuan
    sheet.setColumnWidth(3, 140); // PJ
    sheet.setColumnWidth(4, 200); // Perusahaan
    sheet.setColumnWidth(5, 180); // Narahubung
    sheet.setColumnWidth(6, 130); // Via
    sheet.setColumnWidth(7, 180); // Benefit
    sheet.setColumnWidth(8, 140); // Status
    sheet.setColumnWidth(9, 280); // Keterangan
  }
  return sheet;
}

/**
 * Mengambil ringkasan metrik dan riwayat data sponsor
 */
function getDashboardData() {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Jika hanya ada header
    if (data.length <= 1) {
      return {
        success: true,
        summary: {
          total: 0,
          deal: 0,
          negosiasi: 0,
          menunggu: 0,
          ditolak: 0
        },
        daftarPJ: [],
        listSponsor: []
      };
    }
    
    let total = 0;
    let deal = 0;
    let negosiasi = 0;
    let menunggu = 0;
    let ditolak = 0;
    
    const setPJ = {};
    const listSponsor = [];
    
    // Baris data mulai dari index 1
    // 0: Timestamp, 1: Tgl Pengajuan, 2: Nama PJ, 3: Perusahaan, 4: Narahubung, 5: Via, 6: Benefit, 7: Status, 8: Keterangan
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = row[0] ? formatTanggalTampil(row[0]) : '';
      const tanggalPengajuan = row[1] ? formatTanggalTampil(row[1]) : '';
      const namaPJ = String(row[2] || '').trim();
      const namaPerusahaan = String(row[3] || '').trim();
      const narahubung = String(row[4] || '').trim();
      const via = String(row[5] || '').trim();
      const benefit = String(row[6] || '').trim();
      const status = String(row[7] || '').trim();
      const keterangan = String(row[8] || '').trim();
      
      if (!namaPerusahaan && !namaPJ) continue;
      
      total++;
      
      const sLower = status.toLowerCase();
      if (sLower.includes('deal') || sLower.includes('diterima') || sLower.includes('disetujui') || sLower.includes('gol')) {
        deal++;
      } else if (sLower.includes('tolak') || sLower.includes('batal') || sLower.includes('reject')) {
        ditolak++;
      } else if (sLower.includes('nego') || sLower.includes('diskusi') || sLower.includes('follow up') || sLower.includes('presentasi')) {
        negosiasi++;
      } else {
        menunggu++;
      }
      
      if (namaPJ) {
        setPJ[namaPJ] = true;
      }
      
      listSponsor.push({
        rowNumber: i + 1,
        timestamp: timestamp,
        tanggalPengajuan: tanggalPengajuan,
        namaPJ: namaPJ,
        namaPerusahaan: namaPerusahaan,
        narahubung: narahubung,
        via: via,
        benefit: benefit,
        status: status,
        keterangan: keterangan
      });
    }
    
    // Sort daftar sponsor terbaru di urutan paling atas
    listSponsor.reverse();
    
    return {
      success: true,
      summary: {
        total: total,
        deal: deal,
        negosiasi: negosiasi,
        menunggu: menunggu,
        ditolak: ditolak
      },
      daftarPJ: Object.keys(setPJ).sort(),
      listSponsor: listSponsor
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Menyimpan data input baru progres sponsor ke Google Sheets
 */
function simpanDataProgres(data) {
  try {
    const sheet = getOrCreateSheet();
    const timeZone = Session.getScriptTimeZone() || 'Asia/Jakarta';
    const timestamp = Utilities.formatDate(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss');
    
    const rowData = [
      timestamp,
      data.tanggalPengajuan || Utilities.formatDate(new Date(), timeZone, 'yyyy-MM-dd'),
      String(data.namaPJ || '-').trim(),
      String(data.namaPerusahaan || '-').trim(),
      String(data.narahubung || '-').trim(),
      String(data.via || '-').trim(),
      String(data.benefit || '-').trim(),
      String(data.statusProgress || 'Menunggu Respon').trim(),
      String(data.keteranganProgress || '-').trim()
    ];
    
    sheet.appendRow(rowData);
    
    // Beri format alignment dan border pada row baru
    const lastRow = sheet.getLastRow();
    const newRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    newRange.setVerticalAlignment('middle');
    
    // Ambil data dashboard terbaru untuk sinkronisasi antarmuka
    const dashboard = getDashboardData();
    
    return {
      success: true,
      message: 'Progres sponsor berhasil disimpan ke Google Sheets!',
      dashboard: dashboard
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal menyimpan: ' + error.message
    };
  }
}

/**
 * Update Cepat Status & Keterangan Progres Sponsor yang sudah ada
 */
function updateStatusSponsor(rowNumber, statusBaru, keteranganBaru) {
  try {
    const sheet = getOrCreateSheet();
    const lastRow = sheet.getLastRow();
    
    if (rowNumber < 2 || rowNumber > lastRow) {
      throw new Error('Baris data tidak valid');
    }
    
    if (statusBaru) {
      sheet.getRange(rowNumber, 8).setValue(statusBaru); // Kolom H: Status
    }
    
    if (keteranganBaru) {
      const timeZone = Session.getScriptTimeZone() || 'Asia/Jakarta';
      const tglUpdate = Utilities.formatDate(new Date(), timeZone, 'dd/MM HH:mm');
      const ketLama = sheet.getRange(rowNumber, 9).getValue();
      const ketGabung = ketLama && ketLama !== '-' 
        ? ketLama + `\n[${tglUpdate}] ${keteranganBaru}` 
        : `[${tglUpdate}] ${keteranganBaru}`;
      
      sheet.getRange(rowNumber, 9).setValue(ketGabung); // Kolom I: Keterangan
    }
    
    const dashboard = getDashboardData();
    return {
      success: true,
      message: 'Status progres berhasil diperbarui!',
      dashboard: dashboard
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal update status: ' + error.message
    };
  }
}

/**
 * Helper format tanggal agar tampil estetik
 */
function formatTanggalTampil(val) {
  if (!val) return '';
  if (val instanceof Date) {
    const timeZone = Session.getScriptTimeZone() || 'Asia/Jakarta';
    return Utilities.formatDate(val, timeZone, 'yyyy-MM-dd');
  }
  return String(val);
}
