const pdfmake = require('pdfmake/build/pdfmake.js');
const vfs_fonts = require('pdfmake/build/vfs_fonts.js');
 
(function() {

  if(document.getElementsByClassName("is-slide")) {
    const slide_controller = document.getElementsByClassName("slide_controller")[0]
    const slide_controller_fullscreen = slide_controller.getElementsByClassName("slide_controller_fullscreen")[0]

    let downloadElement = document.createElement("div")
    let buttonElement   = document.createElement("button")
    let iconElement     = document.createElement("i")
    downloadElement.className = "slide_controller_fullscreen slide_controller_download"
    buttonElement.className = "slide_controller_btn clickable"
    iconElement.className = "fa fa-download"
    buttonElement.appendChild(iconElement)
    downloadElement.appendChild(buttonElement)

    //イベント追加
    downloadElement.addEventListener("click", clickDownload)
    //downloadElement.insertBefore(buttonElement.insertBefore(iconElement, buttonElement.firstChild), downloadElement.firstChild)
    slide_controller_fullscreen.parentNode.insertBefore(downloadElement, slide_controller_fullscreen)
  }
})()


function clickDownload() {
  console.log("クリックイベント発動！！")
  pdfmake.vfs = vfs_fonts.pdfMake.vfs;
  pdfmake.fonts = {
    ipam: {
      normal: "ipam.ttf",
      bold: "ipam.ttf",
      italics: "ipam.ttf",
      bolditalics: "ipam.ttf"
    }
  }

  if(document.getElementsByClassName("is-slide")) {
    //タイトルを入れる
    const slideTitle = document.getElementsByClassName("ArticleMainHeader__title")[0].textContent
    const userName   = document.getElementsByClassName("itemsShowAuthorInfo_userName")[0].textContent
    const content = []
    content.push({text: slideTitle, fontSize: 50, margin: [0,200,0,0], alignment: 'center', bold: true})
    content.push({text: "by " + userName, fontSize: 25, margin: [0,30,0,0], color: "#999", alignment: 'center', bold: true})
    content.push({text: "", pageBreak: 'before'})

    const slideSection = document.getElementById("item-13a253a081d329d23292")
    const slideSectionChildren = slideSection.childNodes
    slideSectionChildren.forEach((v, k, listObj)=>{
      if(v.tagName == "H2") {
        content.push({text: v.textContent, fontSize: 25, margin: [0,0,0,10]})

      }else if(v.tagName == "H3") {
        content.push({text: v.textContent, fontSize: 20, margin: [0,0,0,10]})

      }else if(v.tagName == "P"){
        let href = ""
        v.childNodes.forEach((p_v, p_k)=>{
          if(p_v.tagName == "A") {
          	if(p_v.children.length > 0 && p_v.children[0].tagName == "IMG") {
              //imgタグ
              const img = p_v.children[0]
              console.log(img.src)
              var req = new XMLHttpRequest();
              req.open('POST', 'https://hxgddvr96i.execute-api.ap-northeast-1.amazonaws.com/prod/encodeImage', false);
              req.setRequestHeader('content-type','application/json')
              req.send(JSON.stringify({url: img.src, width: img.width, height: img.height}))
              if(req.status == 200) {
                console.log(req.responseText)
                content.push({image: req.responseText})
                //content.push({image: ""})
              }
						}else{
							//url
              href = p_v.getAttribute("href")
              content.push({text: p_v.textContent, fontSize: 16, color: "#33ab7", margin: [0, 0], link: href})
						}
          }else if(p_v.tagName == "STRONG") {
            content.push({text: p_v.textContent, fontSize: 16, margin: [0, 10], bold: true})

          }else if(p_v.tagName == "CODE") {
            content.push({text: p_v.textContent, fontSize: 16, margin: [0, 0], bold: true})

          }else if(p_v.nodeType == Node.TEXT_NODE) {
            console.log(p_v.textContent)
            if(/\r?\n/.test(p_v.textContent) === false) {
              //改行コードの時は何もしない
              content.push({text: p_v.textContent, fontSize: 16, margin: [0, 10]})
            }
          }
				})
      }else if(v.tagName == "DIV") {
        if(v.className == "code-frame") {
          content.push({
            table: {
              headerRows: 0,
              width: "*",
              body: [
                [{text: v.textContent, fontSize: 16, fillColor: "#f7f7f7"}]
              ]
            },
            margin: [0,10]
          })
        }

      }else if(v.tagName == "HR"){
        content.push({text: "", pageBreak: 'before'})
      }else if (v.tagName == "IMG"){
        console.log("imgタグ")
      }
    })
    const docDefinition = { 
      content: content,
      defaultStyle: {
        font: 'ipam'
      }
    };
    pdfmake.createPdf(docDefinition).download();
    //const slides = document.querySelector("section>hr")
  }
  /*
  function imageToBase64(img, mime_type) {
      // New Canvas
      var canvas = document.createElement('canvas');
     	console.log(canvas)
      canvas.width  = img.width;
      canvas.height = img.height;
      // Draw Image
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // To Base64
      return canvas.toDataURL(mime_type);
  }
  */
}
