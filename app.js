import { getCommandParam } from './utils'
import { uploadContentToStrapi } from './strapi-service'
import { uploadFileToStrapi } from './strapi-service'
import { loginToStrapi } from './strapi-service'
import { extractRecordsFromCSV } from './csv-utils'

import './log';

const [ bin, sourcePath, ...args ] = process.argv;

// 'username' param passed via CLI 
const user_param = getCommandParam('username')
const pass_param = getCommandParam('password')

/**
 * Upload all attached files (PDFs, images) to Strapi.
 */
function upload_attachments() {
  
  logger.debug('Uploading all files to Strapi from the CSV.')
  if(user_param && pass_param) {
    
    // Login to Strapi (authenticate for API requests)
    loginToStrapi(user_param, pass_param).then(function () {
      logger.debug('Successful login to Strapi.')
      
      // Extract the records from the CSV file
      extractRecordsFromCSV("records.csv").then(async function(records) {
        
        logger.debug('Got back ${records.length} records from Strapi.')
        // Upload the attachments first, so they can be linked to the items.
        
        // Loop through the records uploading all of the files to Strapi.
        for (var record of records) {
          var tmp_images = record.Images, tmp_attachments = record.Attachments
          
          // wipe out the existing images for upload
          record.Images = [], record.Attachments = []

          // Loop through & upload the images, and then file attachments
          if (tmp_images !== undefined) {
            for (const img of tmp_images) {
              var file = await uploadFileToStrapi(img)
              record.Images.push({ "_id": file['_id'] })
            }
          }

          if (tmp_attachments !== undefined) {
            for (const attachment of tmp_attachments) {
              var file = await uploadFileToStrapi(attachment)
              record.Attachments.push({ "_id": file['_id'] })
            }
          }
        }

      })
    })
  } else {
    logger.debug('Username and/or password not specified.')
  }
}

/**
 * Upload all records, linking attachments, to Strapi.
 */
function upload_content_entries_to_strapi() {

  logger.debug('Uploading all records to Strapi from the CSV')
  if(user_param && pass_param) {
    // Login to Strapi (authenticate for API requests)
    loginToStrapi(user_param, pass_param).then(function () {
      logger.debug('Successful login to Strapi.')

      // Extract the records from the CSV file
      extractRecordsFromCSV("records.csv").then(function(records) {

        logger.debug('Got back ' + records.length + ' records from Strapi.')
        // Upload the content to strapi.
        uploadContentToStrapi(records)
      })
    })
  } else {
    logger.debug('Username and/or password not specified.')
  }
}

