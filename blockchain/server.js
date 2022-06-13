const express = require("express");
var app = express();
const Blockchain = require("./blockchain.js");
const Block = require("./block");
const url = require('url');
const PDFDocument = require('pdfkit');
var fs = require('fs');
var getStream = require('get-stream');
const bodyParser = require('body-parser');
const SHA256 = require('crypto-js/sha256');
app.use(bodyParser.urlencoded({ extended: true }));

// Load blockchain file content into blockchain object for later use
fs = require('fs');
var blockchain;
var numPass;
readFile('./blockchain', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    blockchain = new Blockchain(data ? JSON.parse(data) : null);
    numPass = blockchain.blockchain.length;
});

async function generatePdf(data) {
    try {
        const doc = new PDFDocument();

        doc.fontSize(25).text(data, 100, 100);


        doc.pipe(createWriteStream(`file.pdf`));


        doc.end();

        const pdfStream = await buffer(doc);

        return pdfStream;
    } catch (error) {
        console.log(error);
    }
}


///////////// EXPRESS ROUTING /////////////////////
app.get("/", function (req, res) {

    let data = parse(req.url, true).query;
    res.sendFile( __dirname + "/" + "form.html" );
});

app.post("/add", function (req, res) {
    //Current timestamp in ms
    let ts = Date.now();
    //index,data,timeStamp,prevHash
    blockchain.addNewBlock(new Block("0", { name: req.body.name, cin: req.body.cin }, ts));
    numPass++;
    //save new blockchain version to the blockchain file
    writeFile('./blockchain', JSON.stringify(blockchain.blockchain), function (err) {
        if (err) return console.log(err);
        console.log('saved to the blockchain');
    });
    res.redirect('/');
})


app.get("/verify", function (req, res) {
    //// TRY CATCH
    var userData = parse(req.url, true).query;
    const index = userData.index;
    if (index >= blockchain.blockchain.length)
        res.send("This vaccination pass is invalid!!!");
    const block = blockchain.blockchain[Number(index)];
    const prevHash = blockchain.blockchain[Number(index - 1)].hash;
    const newHash = SHA256(index + userData.data + userData.timeStamp + prevHash).toString();
    if (block.hash === newHash) {
        res.send("The vaccination pass of " + block.data.name + " with the ID number " + block.data.cin + " is valid.");
    } else {
        res.send("This vaccination pass is invalid!!")
    }
});

app.get("/getPass", async function (req, res) {
    const pdfStream = await generatePdf(JSON.stringify(blockchain.blockchain));

    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfStream),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=test.pdf',
    }).end(pdfStream);
});

app.listen(8080);
