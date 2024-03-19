FROM node:21-alpine

ENV DB_URI=mongodb+srv://adminetp:SWRFrPieIbjGMcaf@cluster0.fmbqxxp.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0 \
TEST_DB_URI=mongodb+srv://adminetp:SWRFrPieIbjGMcaf@cluster0.fmbqxxp.mongodb.net/db-contacts-test?retryWrites=true&w=majority&appName=Cluster0 \
PORT=8080 \
SECRET_KEY=f9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0 \
ELASTICEMAIL_API_KEY=CF38857249C4FEEB66EEDACAE792D735F4D378DCF4CDA3382B12F8610F938F0D4CF56F7F550B171E8F0CF614FCD5B3A8

RUN mkdir -p /home/app

COPY . /home/app

WORKDIR /home/app

RUN npm install

CMD ["node", "start"]
