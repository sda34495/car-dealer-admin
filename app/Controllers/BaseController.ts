export default class BaseController {
  public static async sendSuccessSession(session, title) {
    session.flash({
      updates: {
        hasSuccessMessage: true,
        title: title,
      },
    })
  }
}
