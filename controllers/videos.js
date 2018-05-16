const request = require('request-promise');
const express = require("express");
const router = express.Router();
const https = require('https');
const path = require('path');
const fs = require("fs");
const token = "__Your___Token____Here";

router.get("/:keyWord", function(req, resp) {
  let pageNameID = req.params.keyWord;
  let startedTime = Date.now();
  let pageID = 0;
  let pageName = '';
  getPageInfo(pageNameID)
    .then((pageInfo) => {
      pageInfo = JSON.parse(pageInfo);
      pageID = pageInfo.id;
      pageName = pageInfo.name;
      return getPageVideos(pageNameID, 200)
    })
    .then((videos) => {
      let {
        data
      } = JSON.parse(videos);
      let videosCount = data.length;
        return generateArrayOfVideos(data, pageID, pageName, videosCount)
    })
    .then((result) => {
      writeToFile(result , pageName , resp , startedTime);
    })
    .catch(err => sendError(resp , err))
})

const writeToFile = function(arrayToWrite , pageName , resp , startedTime) {
  let currentTime = Date.now();
  arrayToWrite.push({"performed in milliSeconds":(currentTime - startedTime)})
  let file = JSON.stringify(arrayToWrite);
  fs.writeFileSync(`./public/pagesData/${pageName}_${currentTime}.json` ,file, 'utf8');
  resp.status(200).json({
    "data": arrayToWrite
  })
}

const sendError = function(resp , err) {
  console.log(err);
  resp.status(404).json({"message":"requested page not found","err":err})
}

const generateArrayOfVideos = function(data, pageID, pageName, videosCount) {
  let videosArray = [];
  return new Promise((resolve, reject) => {
    data.map((video) => {
      getVideoInfo(video.id, pageID)
        .then((resolvedData) => {
          let videoData = JSON.parse(resolvedData);
            let {
              likes: {
                summary: {
                  total_count: likesCount
                }
              },
              comments: {
                summary: {
                  total_count: commentsCount
                }
              },
              shares: {count} = {}
            } = videoData;
            videosArray.push({
              "videoID": video.id,
              "videoTitle": video.title,
              "pageNameID": pageName,
              "likesCount": likesCount,
              "commentsCount": commentsCount,
              "sharesCount": count
            });
          if (videosArray.length == videosCount) {
            resolve(videosArray)
            videosArray = [];
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

const getPageVideos = function(pageNameID, limit) {
  return request(`https://graph.facebook.com/v3.0/${pageNameID}/videos?fields=title&limit=${limit}&access_token=${token}`);
}

const getPageInfo = function(pageNameID) {
  return request(`https://graph.facebook.com/v3.0/${pageNameID}/?access_token=${token}`);
}

const getVideoInfo = function(videoID, pageID) {
  let videoPostID = pageID + "_" + videoID;
  return request(`https://graph.facebook.com/v3.0/${videoPostID}?fields=likes.limit(0).summary(true),comments.limit(0).summary(true),shares&access_token=${token}`);
}

module.exports = router;
