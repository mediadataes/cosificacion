const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');
const moment = require('moment');
AWS.config.loadFromPath('./AWS.json');
const docClient = new AWS.DynamoDB.DocumentClient();
const fs = require('fs');


const PATH = '';
const TITLE = '';
const ARTIST = '';

fs.readdir(PATH, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file

        let fStream = fs.createReadStream(PATH + '/'+file);
        let uuid = uuidv1();

        pushToS3(fStream, uuid).then(value => {
            console.log(JSON.stringify(value));

            let imagen = {
                TableName: 'cosificabot_frames',
                Item: {
                    "frame_id": uuid,

                    "title": TITLE,
                    "artists": ARTIST,

                    "ai_male_genitalia": 0,
                    "ai_female_genitalia": 0,
                    "ai_male_breast": 0,
                    "ai_female_breast": 0,
                    "tel_focused": 0,
                    "tel_object": 0,
                    "tel_decorative": 0,
                    "tel_abused": 0,
                    "tel_sexualized": 0,
                    "tel_commodity": 0,
                    "tel_canvas": 0,
                    "usr_gender_training": 0,
                    "usr_gender": 0,
                    "usr_age": 0,

                    "created": moment().format(),
                    "co_analyzed": false,
                    "ai_analyzed": false,

                    "url": value.Location

                }
            };

            docClient.put(imagen, function (err, data) {
                if (err) {
                    console.error("Error storing message received: " + err);
                }else console.log("New image uploaded")
            });


        })
    });
});





function pushToS3 (fStream, uuid) {
    return new Promise(function (resolve, reject) {
        let StreamingS3 = require('streaming-s3');
        let uploader = new StreamingS3(fStream, {
                accessKeyId: '',
                secretAccessKey: ''
            },
            {
                Bucket: 'bot.cosificacion',
                Key: uuid+".png",
                ContentType: 'image/png'

            }, function (err, resp, stats) {
                if (err) {
                    console.error("ERROR IN PUSH TO S3: " + err);
                    reject(err);
                } else if (resp) {
                    resolve(resp);
                }
            }
        );
    });

}