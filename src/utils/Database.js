var db
import AWS from 'aws-sdk'
import Utils from './Utils.js'
const TABLE_NAME = 'verseMarker'

function basicCallback(err, data) {
    if (err) {
        alert('error')
        console.log(err)
    }
}

export default {
    init() {
        AWS.config.region = 'us-east-1'
        // Initialize the Amazon Cognito credentials provider
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "us-east-1:689eec1c-db4b-4ffd-a302-50ca83eb5356",
        });

        db = new AWS.DynamoDB();
    },
    saveVerse(fileName, timestamp) {
        db.putItem({
            TableName: TABLE_NAME,
            Item: {
                fileName: {
                    S: fileName
                },
                timestamp: {
                    N: timestamp.toString()
                }
            }
        }, basicCallback)
    },
    fetchVerses(options) {
        db.scan({
            TableName: TABLE_NAME,
            FilterExpression: "fileName = :file",
            ExpressionAttributeValues: {
                ":file": {
                    S: options.fileName
                }
            }
        }, (err, data) => {
            if (err) {
                alert('Error loading verses.')
                console.log(err)
                return
            }
            options.onComplete(this.parseVerses(data))
        })
    },
    parseVerses(data) {
        var verseArray = []
        for (var i = 0; i < data.Count; i++) {
            verseArray.push(parseFloat(data.Items[i].timestamp.N))
        }
        verseArray.sort(Utils.arraySortFunc)
        return verseArray
    }
}
