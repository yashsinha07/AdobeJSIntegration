const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const express = require("express");
const app = express();

var PORT = process.env.port || 3000;

app.get("/app/:storeName/:appId", async function(req, res){
    let appId = req.params['appId'];
    let storeName = req.params['storeName'];
    let APIresponse = await getMetaData(appId ,storeName);

    res.send(APIresponse);

    /*Write response into "input.json" file. Everytime 
    the below function runs, "input.json" get overridden.
    */
    fs.writeFile("./input.json", JSON.stringify(APIresponse, null, 2), err => {
        if(err) {
            console.log(err);
        } else {
            console.log("File sucessfully written");
        }
    });
});


async function getMetaData(appId , storeName){
    /*let storeFunctionMapping = {
        apple : fetchMetaDataForApple,
        zhoushou : fetchMetaDataForZhushou(appId)
    }*/
    if(storeName == "zhushou"){
        return await fetchMetaDataForZhushou(appId);
    }
    // console.log(storeFunctionMapping[storeName])
    //return await storeFunctionMapping[storeName](appId);
}


async function fetchMetaDataForZhushou(appId){
    const url = 'http://zhushou.360.cn/detail/index/soft_id/' + appId;// 'https://itunes.apple.com/lookup?id=284910350';
    try{
       let response = await axios(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let appName = $('#app-name').text();
        let iconUrl = $('.product.btn_type1').find('dl > dt > img').attr('src');
        let scrnshtDiv = $('#scrollbar').attr('data-snaps');
        let scrnshtArr = scrnshtDiv.split(",");
        //*[@id="sdesc"]/div/div/table/tbody/tr[1]/td[1]/text()
        let author = $('#sdesc').find('div > div > table > tbody > tr').first().find('td')
            .first().text().split("：")[1];
        //*[@id="app-info-panel"]/div/dl/dd/div[1]/span[1]
        console.log(author);
        return {
            appName : appName,
            iconUrl : iconUrl,
            screenshotUrl : scrnshtArr
        };
    } catch (error){
        console.log(error);
    }
    /*axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            let appName = $('#app-name').text();
            let iconUrl = $('.product.btn_type1').find('dl > dt > img').attr('src');
            let scrnshtDiv = $('#scrollbar').attr('data-snaps');
            let scrnshtArr = scrnshtDiv.split(",");
            //!*[@id="sdesc"]/div/div/table/tbody/tr[1]/td[1]/text()
            let author = $('#sdesc').find('div > div > table > tbody > tr').first().find('td')
                .first().text().split("：")[1];
            //!*[@id="app-info-panel"]/div/dl/dd/div[1]/span[1]
            console.log(author);
            return {
                appName : appName
            };
        })
        .catch(console.error);*/
}

function fetchMetaDataForApple(appId){
}


app.listen(PORT, function(error){
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
});

module.exports = {getMetaData};