import Application from '@ioc:Adonis/Core/Application'

export default class MediaUploader {
  public static async uploadImage(file, path) {
    if (file) {
      const newFileName = (new Date().toISOString() + file.clientName).replace(
        /[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/ \s]/gi,
        ''
      )
      await file.move(Application.tmpPath('uploads/' + path), {
        name: newFileName.toString().toLowerCase(),
        overwrite: true, // overwrite in case of conflict
      })
      return `/uploads/${path}/${newFileName}`
    } else {
      return ''
    }
  }
}
