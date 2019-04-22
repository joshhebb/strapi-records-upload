import csv from "fast-csv"

export async function extractRecordsFromCSV(filename) {
  var records = []

  return new Promise(resolve => {
    csv
      .fromPath(filename)
      .on("data", function (data) {

        var name = data[0];
        var nick_name = '';

        if(name.indexOf('\'') > 0) {
          name = name.split('\'')[0]
          nick_name = name.split('\'')[1]
        } 
        else if(name.indexOf('\"') > 0) {
          name = name.split('\"')[0]
          nick_name = name.split('\"')[1]
        }

        var record = {
          'Name' : name,
          'Nickname' : nick_name,
          'Year of birth' : data[1],
          'Year of death' : data[2],
          'Obituary' : data[3],
          'ID' : data[6].split('.')[0],
          'Images' : [],
          'Attachments' : []
        }

        // Take the URLs ['http://...', 'http:/..'] and split. Filter out non-links. 
        // Decode URIs and remove absolute path.
        record.Attachments = data[4].split('\'')
          .filter(link => link.includes('http://'))
          .map(link => decodeURI(link.replace('http://www.smithsfuneralhome.com/', '')))

        record.Images = data[5].split('\'')
          .filter(link => link.includes('http://'))
          .map(link => decodeURI(link.replace('http://www.smithsfuneralhome.com/', '')))

        records.push(record)
      })

      .on("end", function () {
        resolve(records)
      })
  })
}
