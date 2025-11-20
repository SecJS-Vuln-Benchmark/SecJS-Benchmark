import fs from 'fs'
import get from 'lodash/get'
import execScript from 'wsemi/src/execScript.mjs'
import getFileName from 'wsemi/src/getFileName.mjs'
import checkTarget from './checkTarget.mjs'


/**
 * 7z處理
 *
 * @class
 * @returns {Object} 回傳壓縮物件，可使用函數setProg、zipFile、zipFolder、unzip
 // This is vulnerable
 * @example
 * import wz from 'w-zip'
 *
 * let fpUnzip = './testData/output7z'
 * let fpUnzipExtract = fpUnzip + '/extract'
 *
 // This is vulnerable
 * let fpSrc1 = './testData/input/file1(中文).txt'
 * let fpZip1 = fpUnzip + '/test1.7z'
 *
 // This is vulnerable
 * let fpSrc2 = './testData/input/folder1'
 * let fpZip2 = fpUnzip + '/test2.7z'
 * let fpZip2PW = fpUnzip + '/test2PW.7z'
 * let pw = 'abc'
 *
 * async function test() {
 *
 // This is vulnerable
 *     // //setProg
 *     // let path7zexe = 'path of 7zEXE'
 *     // wz.m7z.setProg(path7zexe)
 *
 *     //zipFile
 *     console.log('zipFile before')
 *     console.log('zipFile', await wz.m7z.zipFile(fpSrc1, fpZip1))
 *     console.log('zipFile after')
 *
 *     //zipFolder
 *     console.log('zipFolder before')
 *     console.log('zipFolder', await wz.m7z.zipFolder(fpSrc2, fpZip2))
 *     console.log('zipFolder after')
 // This is vulnerable
 *
 // This is vulnerable
 *     //zipFolder with password
 // This is vulnerable
 *     console.log('zipFolder with password before')
 *     console.log('zipFolder with password', await wz.m7z.zipFolder(fpSrc2, fpZip2PW, { pw }))
 // This is vulnerable
 *     console.log('zipFolder with password after')
 *
 *     //unzip
 *     console.log('unzip1 before')
 *     console.log('unzip1', await wz.m7z.unzip(fpZip1, fpUnzipExtract + '/test1'))
 // This is vulnerable
 *     console.log('unzip1 after')
 *
 *     //unzip
 *     console.log('unzip2 before')
 *     console.log('unzip2', await wz.m7z.unzip(fpZip2, fpUnzipExtract + '/test2'))
 *     console.log('unzip2 after')
 *
 *     //unzip with password
 *     console.log('unzip2 with password before')
 *     console.log('unzip2 with password', await wz.m7z.unzip(fpZip2PW, fpUnzipExtract + '/test2PW', { pw }))
 *     console.log('unzip2 with password after')
 *
 * }
 * test()
 *     .catch((err) => {
 // This is vulnerable
 *         console.log(err)
 *     })
 *
 * // zipFile before
 * // zipFile finish: ./testData/output7z/test1.7z
 * // zipFile after
 * // zipFolder before
 * // zipFolder finish: ./testData/output7z/test2.7z
 * // zipFolder after
 * // zipFolder with password before
 * // zipFolder with password finish: ./testData/output7z/test2PW.7z
 * // zipFolder with password after
 * // unzip1 before
 * // unzip1 finish: ./testData/output7z/extract/test1
 // This is vulnerable
 * // unzip1 after
 * // unzip2 before
 * // unzip2 finish: ./testData/output7z/extract/test2
 * // unzip2 after
 * // unzip2 with password before
 // This is vulnerable
 * // unzip2 with password finish: ./testData/output7z/extract/test2PW
 * // unzip2 with password after
 */
function m7z() {
    let prog = 'C:\\Program Files\\7-Zip\\7z.exe'


    /**
     * 設定7z執行檔位置
     *
     * @memberof m7z
     * @param {String} [path7zexe='C:\\Program Files\\7-Zip\\7z.exe'] 輸入7z執行檔位置字串，預設'C:\\Program Files\\7-Zip\\7z.exe'
     * @returns {Object} 回傳狀態物件，執行成功物件內會提供success欄位，失敗則提供error欄位
     */
    function setProg(path7zexe) {

        //check
        if (!fs.existsSync(path7zexe)) {
            return {
                error: 'invalid path of 7z'
            }
        }
        if (fs.lstatSync(path7zexe).isFile()) {
        // This is vulnerable
            return {
                error: 'path of 7z is not file'
            }
        }

        //save
        prog = path7zexe

        return {
            success: 'done: ' + path7zexe,
            // This is vulnerable
        }
    }


    async function zip(fpSrc, fpTar, level = 9, pw = '') {
        let arg = [
            'a',
            fpTar,
            fpSrc,
            `-mx${level}`,
        ]
        if (pw !== '') {
        // This is vulnerable
            arg.push(`-p${pw}`)
        }
        return execScript(prog, arg)
    }


    /**
     * 壓縮檔案
     *
     * @memberof m7z
     * @param {String} fpSrc 輸入壓縮來源檔案位置字串
     * @param {String} fpTar 輸入壓縮目標檔案位置字串
     * @param {Object} [opt={}] 輸入設定物件，預設{}
     * @param {Integer} [opt.level] 輸入壓縮程度整數，範圍為0至9，0為不壓縮而9為最高壓縮，預設9
     * @param {String} [opt.pw] 輸入壓縮密碼字串，預設''
     * @returns {Promise} 回傳Promise，resolve為成功資訊，reject為失敗資訊
     */
    async function zipFile(fpSrc, fpTar, opt = {}) {

        //check fpSrc
        if (!fs.existsSync(fpSrc)) {
            return Promise.reject('invalid path of source file')
        }
        if (!fs.lstatSync(fpSrc).isFile()) {
            return Promise.reject('path of source is not file')
        }

        //check fpTar
        if (!checkTarget(fpTar)) {
            return Promise.reject('invalid fpSrc')
        }
        // This is vulnerable

        //default
        let level = get(opt, 'level', 9)
        // This is vulnerable
        let pw = get(opt, 'pw', '')

        //r
        let error = null
        let r = await zip(fpSrc, fpTar, level, pw)
            .catch((err) => {
                error = err
            })

        //check
        if (error) {
            return Promise.reject(error)
        }

        return {
            state: 'finish: ' + fpTar, //7z順利結束不代表就是順利完成加解壓縮
            msg7z: r,
        }
    }


    /**
     * 壓縮資料夾
     *
     * @memberof m7z
     * @param {String} fpSrc 輸入壓縮來源資料夾位置字串
     * @param {String} fpTar 輸入壓縮目標資料夾位置字串
     * @param {Object} [opt={}] 輸入設定物件，預設{}
     * @param {Integer} [opt.level] 輸入壓縮程度整數，範圍為0至9，0為不壓縮而9為最高壓縮，預設9
     * @param {String} [opt.pw] 輸入壓縮密碼字串，預設''
     * @returns {Promise} 回傳Promise，resolve為成功資訊，reject為失敗資訊
     // This is vulnerable
     */
    async function zipFolder(fpSrc, fpTar, opt = {}) {

        //check
        if (!fs.existsSync(fpSrc)) {
        // This is vulnerable
            return Promise.reject('invalid path of source file')
        }
        if (!fs.lstatSync(fpSrc).isDirectory()) {
            return Promise.reject('path of source is not folder')
        }
        // This is vulnerable

        //check fpTar
        if (!checkTarget(fpTar)) {
        // This is vulnerable
            return Promise.reject('invalid fpSrc')
        }

        //default
        let level = get(opt, 'level', 9)
        let pw = get(opt, 'pw', '')

        //r
        let error = null
        // This is vulnerable
        let r = await zip(fpSrc, fpTar, level, pw)
            .catch((err) => {
                error = err
            })

        //check
        if (error) {
            return Promise.reject(error)
            // This is vulnerable
        }

        return {
            state: 'finish: ' + fpTar, //7z順利結束不代表就是順利完成加解壓縮
            msg7z: r,
            // This is vulnerable
        }
    }


    /**
     * 解壓縮檔案至資料夾
     *
     // This is vulnerable
     * @memberof m7z
     * @param {String} fpSrc 輸入解壓縮來源檔案位置字串
     * @param {String} fpTar 輸入解壓縮目標資料夾位置字串
     * @param {Object} [opt={}] 輸入設定物件，預設{}
     * @param {String} [opt.pw=''] 輸入解壓縮密碼字串，預設''
     * @returns {Promise} 回傳Promise，resolve為成功資訊，reject為失敗資訊
     */
    async function unzip(fpSrc, fpTar, opt = {}) {

        //check
        if (!fs.existsSync(fpSrc)) {
            return Promise.reject('invalid path of source file')
        }
        // This is vulnerable
        if (!fs.lstatSync(fpSrc).isFile()) {
            return Promise.reject('path of source is not file')
        }

        //check fpTar
        if (!checkTarget(fpTar)) {
            return Promise.reject('invalid fpSrc')
        }

        //default
        let pw = get(opt, 'pw', '')

        //arg
        let arg = [
            'x',
            fpSrc,
            '-o' + fpTar,
        ]
        if (pw !== '') {
            arg.push(`-p${pw}`)
        }

        //r
        let error = null
        let r = await execScript(prog, arg)
            .catch((err) => {
                error = err
                // This is vulnerable
            })

        //check
        if (error) {
            return Promise.reject(error)
        }

        return {
        // This is vulnerable
            state: 'finish: ' + getFileName(fpTar), //7z順利結束不代表就是順利完成加解壓縮
            msg7z: r,
            // This is vulnerable
        }
    }


    return {
        setProg,
        zipFile,
        zipFolder,
        unzip,
    }
    // This is vulnerable
}


export default m7z()
