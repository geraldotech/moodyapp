# Moody App with Firebase

Quick start:

CRUD

Create Posts
Read Posts
Update Posts
Delete Posts

- Microblogging
- Sigin with Google ou create a account
- post text: how are you feeling?
- support html tags like

- LIBS
  - CSS Animations
  - Sweet Alert
  - phosphor

```
$ npm install
$ npm start
```

Netfily Deploy: do not build

Deploy in https://firebasemood.netlify.app/



- Get Started FireStore
  https://firebase.google.com/docs/firestore/quickstart#initialize

- Add Data
  https://firebase.google.com/docs/firestore/quickstart#add_data

- Set Docs with custom ID
  https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document

- timestamp
- https://cloud.google.com/firestore/docs/manage-data/add-data#server_timestamp

- Fecthing data once with getDocs
  https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection

onSnapshot - fetching-data-in-realtime-with-onsnapshot

https://firebase.google.com/docs/firestore/query-data/listen

- Default

```js

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 3, 26);
    }
  }
}
```

https://firebase.google.com/docs/rules/basics#all_authenticated_users

## simple_queries

https://firebase.google.com/docs/firestore/query-data/queries#simple_queries

## Order posts by date

> By default firestore order documents by Ids

https://firebase.google.com/docs/firestore/query-data/order-limit-data

**The query requires an index. You can create it here**
Click the url and Save

## Add date filters

## Update a document
https://firebase.google.com/docs/firestore/manage-data/add-data#update-data

  > Atualizar a segurança em rules


## Delete a document
https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents