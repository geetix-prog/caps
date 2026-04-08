/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_teams_001")

  // remove is_public field
  collection.fields.removeById("bool_public_teams")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_teams_001")

  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool_public_teams",
    "name": "is_public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
