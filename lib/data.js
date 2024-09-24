/**
 * Data Write, Read, Update Module
 */


// Dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, '../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {

    // open file for writing
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {

        if(!err && fileDescriptor) {

            const stringData = JSON.stringify(data);

            fs.write(fileDescriptor, stringData, (err2) => {

                if(!err2) {

                    fs.close(fileDescriptor, (err3) => {

                        if(!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file!');
                        }
                        
                    });

                } else {
                    callback('Error writing to new file');
                }

            });

        } else {
            callback('Could not create new file, it may already exist');
        }
    });

}

// read from file
lib.read = (dir, file, callback) => {

    fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf8', (err,data) => {
        callback(err, data);
    })

};

// Update Existing File
lib.update = (dir, file, data, callback) => {

    // file open for writing
    fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {

        if(!err && fileDescriptor) {

            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, (err2) => {

                if(!err2) {

                    fs.write(fileDescriptor, stringData, (err3) => {

                        if(!err3) {

                            fs.close(fileDescriptor, (err4) => {

                                if(!err4) {
                                    callback(false);
                                } else {
                                    callback('Error Closing File')
                                }

                            })

                        } else {
                            callback('Error Writing to file');
                        }

                    });

                } else {
                    callback('Error Truncation File');
                }

            });

        } else {
            callback('Error Updating ile. File may not exist');
        }

    })

};

// delete file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {

        if(!err) {
            callback(false);
        } else {
            callback('Failed To Delete File');
        }

    });
}

module.exports = lib;