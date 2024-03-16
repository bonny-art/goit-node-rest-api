import ElasticEmail from "@elasticemail/elasticemail-client";
import path from "path";

const { ELASTICEMAIL_API_KEY } = process.env;

const client = ElasticEmail.ApiClient.instance;

const apikey = client.authentications["apikey"];
apikey.apiKey = ELASTICEMAIL_API_KEY;

const emailsApi = new ElasticEmail.EmailsApi();

export const sendMail = (req, res, next) => {
  try {
    const verificationPath =
      req.protocol +
      "://" +
      path.join(
        req.get("host"),
        "api",
        "users",
        "verify",
        req.user.verificationToken
      );

    const htmlContent = `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff;">
    <div style="background-color: #007bff; color: #ffffff; padding: 10px; text-align: center;">
      <h1>Вітаємо у Сервісі!</h1>
    </div>
    <div style="padding: 20px; text-align: center;">
      <p>Дякуємо за реєстрацію!</p>
      <p>Будь ласка, натисніть на кнопку нижче, щоб підтвердити свою електронну адресу ${req.body.email}:</p>
      <a href="${verificationPath}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px;">Підтвердити Email</a>
    </div>
    <div style="background-color: #333; color: #ffffff; padding: 10px; text-align: center;">
      <p>Якщо у вас виникли питання, будь ласка, зв'яжіться з нами.</p>
    </div>
  </div>
</body>
</html>`;

    const emailData = {
      Recipients: {
        To: [req.body.email],
      },
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: htmlContent,
            // Content: "hi",
          },
        ],
        From: "svitlana.otenko@gmail.com",
        Subject: "Confirm the registration on Phonebook.com",
      },
    };
    const campaign = {
      Name: "hello campaign",
      Recipients: {
        ListNames: ["Svitlana"],
        SegmentNames: null,
      },
      Content: [
        {
          From: "svitlana.otenko@gmail.com",
          ReplyTo: "svitlana.otenko@gmail.com",
          TemplateName: "hello_template",
          Subject: "Hello",
        },
      ],
      Status: "Draft",
    };

    const callback = (error, data, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log("API called successfully.");
        console.log("Email sent.");
      }
    };

    emailsApi.emailsTransactionalPost(emailData, callback);

    res.status(201).send({
      user: {
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
