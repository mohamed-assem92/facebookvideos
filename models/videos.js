const request = require('request-promise');
const express = require("express");
const router = express.Router();
const https = require('https');
const path = require('path');
const fs = require("fs");
const token = "EAACEdEose0cBACubeZBdnTDm4LXStYGe2o9skNRbp21tyUI5HRQZAA53TJea6LFkMAB5eSRf1q7JcIPJjR9n6GtSW5oOZCbeL8wyzTzHhzzqTSg6q0FUPMNOIGRaVWpZCSjMkmoF4Opm4wHmyDy6fR7X7K04Sjw7iGS3IgPcXXjJPaGFHZAqsRvQEfjaF89cQfrQqjU6f5QZDZD";

router.get("/:keyWord", function(req, resp) {
  let pageName = req.params.keyWord;
  console.log(pageName);

  getPageInfo(pageName)
    .then((pageInfo) => {
      let {
        id: pageID,
        name
      } = JSON.parse(pageInfo);

      getPageVideos(pageName, 200)
        .then((videos) => {
          let {
            data
          } = JSON.parse(videos);

          let videosCount = data.length;

          generateArrayOfVideos(data, pageID, name, videosCount)
            .then((result) => {
              let file = JSON.stringify(result);
              fs.writeFileSync(`./public/pagesData/${name}_${Date.now()}.json` ,file, 'utf8');
              resp.json({
                "data": result
              })
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err);
        })
    })
})

const generateArrayOfVideos = function(data, pageID, name, videosCount) {
  let videosArray = [];
  return new Promise((resolve, reject) => {
    data.map((video) => {
      getVideoInfo(video.id, pageID)
        .then((resolvedData) => {
          let videoData = JSON.parse(resolvedData);
          if (videoData.shares) {
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
              shares: {
                count: sharesCount
              }
            } = videoData;
            videosArray.push({
              "videoID": video.id,
              "videoTitle": video.title,
              "pageName": name,
              "likesCount": likesCount,
              "commentsCount": commentsCount,
              "sharesCount": sharesCount
            });
          } else {
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
              }
            } = videoData;
            videosArray.push({
              "videoID": video.id,
              "videoTitle": video.title,
              "pageName": name,
              "likesCount": likesCount,
              "commentsCount": commentsCount
            });
          }
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

const getPageVideos = function(pageName, limit) {
  return request(`https://graph.facebook.com/v3.0/${pageName}/videos?fields=title&limit=${limit}&access_token=${token}`);
}

const getPageInfo = function(pageName) {
  return request(`https://graph.facebook.com/v3.0/${pageName}/?access_token=${token}`);
}

const getVideoInfo = function(videoID, pageID) {
  let videoPostID = pageID + "_" + videoID;
  return request(`https://graph.facebook.com/v3.0/${videoPostID}?fields=likes.limit(0).summary(true),comments.limit(0).summary(true),shares&access_token=${token}`);
}

module.exports = router;
