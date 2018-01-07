const fs = require('fs')
var format = require('date-format')

console.log("Inlining the bundles into index.html.")

//const LZW_CODE = 57344
const f = String.fromCharCode;

let htmlIndex = fs.readFileSync("./index.html", 'utf8')

let jsBundle = fs.readFileSync("./dist/app.min.js", 'utf8')

jsBundle = jsBundle.slice(0, -1)

let cssGlobal = fs.readFileSync('./global.min.css', 'utf8')

//compress the js bundle
//now done via REGPACK

//inline the js
let result = htmlIndex.replace(/<script src="dist\/app.js"><\/script>/, `<script>${jsBundle}</script>`)

//inline the css
result = result.replace(/<link rel='stylesheet' href='global.css'>/, `<style>${cssGlobal}</style>`)

//write the file

fs.writeFileSync('./dist/index.html', result, 'utf8')

const stats = fs.statSync("./dist/index.html")


console.log (`
File Size:  ${stats.size}
`)



fs.appendFileSync("./log.txt", `${format('MM-dd | hh.mm.ss |')}  File size: ${stats.size}
`  )