import Strapi from 'strapi-sdk-javascript'
import { basename } from 'path'

import { getCommandParam } from './utils'

const host_name = getCommandParam('hostname')
const strapi = new Strapi(host_name)

/** 
 * Login to Strapi and store the token so that future requests are authenticated.
 */
export function loginToStrapi(username, password) {
    return new Promise(async resolve => {
        var login_response = await strapi.login(username, password)
        await strapi.setToken(login_response.jwt)
        resolve(login_response.awt)
    })
}

export async function uploadContentToStrapi(records) {
    for (var record of records) {
  
      // check if the record already exists (by name)
      var existing_record = await strapi.getEntries('Records', { 'Name_contains': record.Name });
  
      if (existing_record.length > 0) {
        // update the existing record
        await strapi.updateEntry('Records', existing_record[0]['_id'], record).then(record => {
          logger.debug("Updated existing record.")
        }).catch(error => {
          console.error("Error saving record : " + error)
        })
      } 
      else {
        // create the fresh entry
        await strapi.createEntry('Records', record).then(record => {
          logger.debug("Created new record.")
        }).catch(error => {
          logger.error("Error saving record : " + error)
        })
      }
    }
  }


  /**
 * Upload an individual file to Strapi.
 * @param {*} filename 
 */
export async function uploadFileToStrapi(filename) {
    filename = basename(filename)
    logger.debug("Attempting to upload file : " + filename)
  
    return new Promise(async resolve => {
      // check and see if this file is already uploaded.
      var file_search = await strapi.searchFiles(filename)
  
      if (file_search.length > 0) {
        logger.debug("File found already uploaded : " + JSON.stringify(file_search[0]))
        resolve(file_search[0])
      } else {
        const form = new FormData()
        form.append('files', createReadStream('files/' + filename))
        logger.debug('Uploading file since it could not be found : ' + filename)
  
        // If no files were found in the search..
        await strapi.upload(form, {
          headers: form.getHeaders()
        }).then(file => {
          resolve(file)
        }).catch(error => {
          logger.error("Error : " + error)
          reject(error.message)
        })
      }
    })
  }