// Mongoose kütüphanesini dahil et
const mongoose = require('mongoose');

// Express kütüphanesini dahil et
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Veritabanı bağlantı adresini .env dosyasından alabilirsiniz

// Veritabanına bağlan
mongoose.connect('mongodb+srv://furkan:O6n9c2e7*@czmcluster.0h9u0ui.mongodb.net/ChProject_DB', {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
 .then((result) => console.log('Veritabanına bağlandı'))
 .catch((err) => console.error(err));

// Ana şemayı oluştur
const mapSchema = new mongoose.Schema({
 width: String,
 height: String,
 horizontalLines: String,
 selectedAreaNumber: String,
 verticalLines: String,
 imageData: {
 name: String,
 content: String
 },
 horizontalDistances: [String], // Yatay mesafeler için bir dizi tanımla
 verticalDistances: [String] // Dikey mesafeler için bir dizi tanımla
});

// Ana modeli oluştur
const Map = mongoose.model('Map', mapSchema);

// Express uygulamasını oluştur
const app = express();

// JSON verilerini işlemek için middleware kullan
app.use(express.json());
app.use(cors());

// İstek hızını sınırlamak için rate limit ayarlarını tanımla
const limiter = rateLimit({
 windowMs: 10 * 60 * 1000, // 10 dakika
 max: 100 // 10 dakika içinde maksimum 100 istek
});

// Rate limit middleware'ini uygula
app.use(limiter);

// Sunucuya gelen post isteklerini /api/images yoluyla yönlendir
app.post('/api/images', (req, res) => {
 // İstekten gelen veriyi al
 const inputData = req.body;

 // Veriyi Map modeline uygun şekilde dönüştür
 const mapData = new Map({
 width: inputData.width,
 height: inputData.height,
 horizontalLines: inputData.horizontalLines,
 selectedAreaNumber: inputData.selectedAreaNumber,
 verticalLines: inputData.verticalLines,
 imageData: {
 name: inputData.imageData.name,
 content: inputData.imageData.content
 },
 horizontalDistances: inputData.horizontalDistances, // İstekten gelen yatay mesafeleri al
 verticalDistances: inputData.verticalDistances // İstekten gelen dikey mesafeleri al
 });

 // Veriyi veritabanına kaydet
 mapData.save()
 .then((result) => {
 // Başarılı olduğunda 201 kodu ve kaydedilen veriyi döndür
 res.status(201).json(result);
 })
 .catch((err) => {
 // Hata olduğunda 500 kodu ve hatayı döndür
 res.status(500).json(err);
 });
});


// Sunucudan verileri getir
app.get('/api/images', (req, res) => {
    // Tüm verileri getir
    Map.find({})
      .then((data) => {
        // Başarılı olduğunda verileri döndür
        res.json(data);
      })
      .catch((err) => {
        // Hata olduğunda 500 kodu ve hatayı döndür
        res.status(500).json(err);
      });
  });

  
// Sunucuyu belirli bir portta dinlemeye başlat
const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`Sunucu ${port} numaralı portta çalışıyor`);
});
