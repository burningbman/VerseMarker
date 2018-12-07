var db
import AWS from 'aws-sdk'
import Utils from './Utils.js'
const TABLE_NAME = 'verseMarker'

function basicCallback(err/*, data*/) {
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
    /**
     * [saveVerse description]
     * @param {Object} options options
     * @param {String} [options.id] id
     * @param {String} options.book file name for now
     * @param {Integer} options.timestamp timestamp
     */
    saveVerse(options) {
        db.putItem({
            TableName: TABLE_NAME,
            Item: {
                id: {
                    S: options.id
                },
                book: {
                    S: options.book
                },
                timestamp: {
                    N: options.timestamp.toString()
                }
            }
        }, basicCallback)
    },
    deleteVerse(options) {
        db.deleteItem({
            TableName: TABLE_NAME,
            Key: {
                book: {
                    S: options.book
                },
                id: {
                    S: options.id
                }
            }
        }, basicCallback)
    },
    fetchVerses(options) {
        db.scan({
            TableName: TABLE_NAME,
            FilterExpression: "book = :book",
            ExpressionAttributeValues: {
                ":book": {
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
            var item = data.Items[i];
            var verse = {
                id: item.id.S,
                timestamp: parseFloat(item.timestamp.N),
                book: item.book.S
            }
            verseArray.push(verse)
        }
        verseArray.sort(Utils.arraySortFunc)
        return verseArray
    }
}
