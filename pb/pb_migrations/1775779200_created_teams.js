/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id = creator",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_name_teams",
        "max": 50,
        "min": 1,
        "name": "name",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_desc_teams",
        "max": 500,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file_logo_teams",
        "maxSelect": 1,
        "maxSize": 5242880,
        "mimeTypes": ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
        "name": "logo",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": ["100x100"],
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "rel_creator_teams",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "creator",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "[A-Z0-9]{8}",
        "hidden": false,
        "id": "text_invitecode_teams",
        "max": 8,
        "min": 8,
        "name": "invite_code",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "bool_public_teams",
        "name": "is_public",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "autodate_created_teams",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate_updated_teams",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_teams_001",
    "indexes": [
      "CREATE UNIQUE INDEX idx_teams_invite_code ON teams (invite_code)"
    ],
    "listRule": "",
    "name": "teams",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = creator",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_teams_001");
  return app.delete(collection);
})
