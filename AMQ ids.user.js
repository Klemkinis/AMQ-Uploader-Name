// ==UserScript==
// @name         AMQ ids
// @version      0.1
// @match        https://animemusicquiz.com/admin/approveVideos
// @grant        none
// ==/UserScript==

var uploaderEndpoint
setup()

function setup() {
    uploaderEndpoint = getUploaderEndpoint()
    if (uploaderEndpoint == null) {
        throw "Missing endpoint configuration!"
        return
    }

    var uploaderId = getUploaderField().innerHTML
    checkUploaderName(uploaderId)
}

function getUploaderEndpoint() {
    var cookieKey = "uploaderEndpoint"
    var cookieList = document.cookie.split(";")
    var cookie = cookieList.find(function(cookie) {
        return cookie.includes(cookieKey)
    })

    if (cookie == null) {
        return null
    }

    var cookieValue = cookie.substring(cookieKey.length + 2)
    return cookieValue
}

function checkUploaderName(uploaderId) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (this.readyState != 4 || this.status != 200) {
            return
        }

        var response = JSON.parse(this.responseText)
        var username = "unidentified"
        if (response != null) {
            username = response.userNick
        }

        getUploaderField().innerHTML = uploaderId + " (" + username + ")"
    }

    request.open("GET", uploaderEndpoint + uploaderId +".json", true)
    request.send()
}

function getUploaderField() {
    var songInfoTable = document.getElementsByClassName('table')[0]
    if (songInfoTable == null) {
        throw "Missing song info table!"
    }

    var songInfoTableBody = songInfoTable.children[0]
    if (songInfoTableBody == null) {
        throw "Missing song info table data!"
    }

    var uploaderRow = songInfoTableBody.children[5]
    if (uploaderRow == null) {
        throw "Missing uploader row in song info table!"
    }

    return uploaderRow.children[1]
}
