/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Met is_public = true sur toutes les équipes existantes
  const teams = app.findAllRecords("teams")
  for (const team of teams) {
    team.set("is_public", true)
    app.save(team)
  }
}, (_app) => {
  // pas de rollback nécessaire
})
