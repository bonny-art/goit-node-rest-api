import ElasticEmail from "@elasticemail/elasticemail-client";

const { ELASTICEMAIL_API_KEY } = process.env;

const client = ElasticEmail.ApiClient.instance;

const apikey = client.authentications["apikey"];
apikey.apiKey = ELASTICEMAIL_API_KEY;

const emailsApi = new ElasticEmail.EmailsApi();

export const sendMail = (req, res, next) => {
  try {
    const emailData = {
      Recipients: {
        To: [req?.body.email],
      },
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: "Hi you!",
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

    next();
  } catch (error) {
    next(error);
  }
};
