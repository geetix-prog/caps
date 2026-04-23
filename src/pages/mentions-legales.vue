<script setup lang="ts">
defineOptions({ name: 'MentionsLegalesPage' })
</script>

<template>
  <div class="min-h-screen text-white font-montserrat pt-28 pb-20 px-6">
    <div class="max-w-3xl mx-auto">

      <!-- En-tête -->
      <div class="mb-14">
        <span class="bg-white/10 border border-white/20 text-white/70 text-xs font-bold px-3 py-1 rounded-full font-montserratAlt uppercase tracking-widest">
          Légal
        </span>
        <h1 class="font-montserratAlt font-black text-4xl sm:text-5xl mt-5 mb-3">
          Politique de confidentialité
        </h1>
        <p class="text-white/50 text-sm">
          Dernière mise à jour : Avril 2026
        </p>
      </div>

      <!-- Sections -->
      <div class="flex flex-col gap-8">

        <!-- 1. Responsable de traitement -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            1. Responsable du traitement
          </h2>
          <p class="text-white/80 leading-relaxed">
            Le responsable du traitement des données collectées sur ce site est :
          </p>
          <ul class="mt-4 flex flex-col gap-2 text-white/70 text-sm">
            <li><span class="text-white font-semibold">Structure :</span> CAPS - Association étudiante MMI Montbéliard</li>
            <li><span class="text-white font-semibold">Responsable :</span> Mathis Guellati</li>
            <li><span class="text-white font-semibold">Site web :</span> https://capsofficiel.mathis-guellati.fr/</li>
            <li>
              <span class="text-white font-semibold">Contact :</span>
              <a href="mailto:mathis.guellati@gmail.com" class="text-primary underline underline-offset-2 ml-1 hover:opacity-80 transition-opacity">
                mathis.guellati@gmail.com
              </a>
            </li>
          </ul>
        </section>

        <!-- 2. Objectif du site -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            2. Objectif du site
          </h2>
          <p class="text-white/80 leading-relaxed">
            CAPS est une plateforme à destination des étudiants. Elle permet de créer un compte, de rejoindre ou de créer des équipes, et de suivre les émissions, rediffusions et contenus produits par l'association.
          </p>
          <p class="text-white/60 leading-relaxed mt-3 text-sm">
            La création d'un compte est nécessaire pour accéder à certaines fonctionnalités (gestion d'équipe, profil personnalisé). La consultation des émissions et des équipes est accessible sans inscription.
          </p>
        </section>

        <!-- 3. Données collectées -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            3. Données collectées
          </h2>
          <p class="text-white/80 leading-relaxed mb-5">
            Lors de votre inscription, nous collectons les informations suivantes :
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex items-start gap-4 bg-white/5 rounded-xl px-5 py-4">
              <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
              <div>
                <p class="font-semibold text-white">Nom d'utilisateur</p>
                <p class="text-white/50 text-sm mt-0.5">Identifiant public affiché sur votre profil et vos équipes.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white/5 rounded-xl px-5 py-4">
              <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
              <div>
                <p class="font-semibold text-white">Adresse e-mail</p>
                <p class="text-white/50 text-sm mt-0.5">Utilisée pour la connexion et, si besoin, la récupération de compte. Non visible publiquement par défaut.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white/5 rounded-xl px-5 py-4">
              <div class="w-2 h-2 rounded-full bg-white/30 flex-shrink-0 mt-1.5"></div>
              <div>
                <p class="font-semibold text-white">Avatar <span class="text-white/40 font-normal text-sm">(optionnel)</span></p>
                <p class="text-white/50 text-sm mt-0.5">Image de profil choisie par l'utilisateur. Aucune image n'est imposée.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white/5 rounded-xl px-5 py-4">
              <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
              <div>
                <p class="font-semibold text-white">Mot de passe</p>
                <p class="text-white/50 text-sm mt-0.5">Stocké sous forme <strong class="text-white/70">hachée et sécurisée</strong> (bcrypt). Nous n'avons pas accès à votre mot de passe en clair.</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white/5 rounded-xl px-5 py-4">
              <div class="w-2 h-2 rounded-full bg-white/20 flex-shrink-0 mt-1.5"></div>
              <div>
                <p class="font-semibold text-white/60">Données techniques automatiques</p>
                <p class="text-white/40 text-sm mt-0.5">Identifiant interne, date de création et de mise à jour du compte (générés automatiquement par le système).</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. Finalité et base légale -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            4. Finalité et base légale
          </h2>
          <div class="flex flex-col gap-4">
            <div>
              <h3 class="font-semibold text-white mb-1">Pourquoi ces données sont-elles collectées ?</h3>
              <ul class="text-white/70 text-sm leading-relaxed flex flex-col gap-1.5 mt-2">
                <li>- Créer et gérer votre compte utilisateur</li>
                <li>- Vous permettre de rejoindre ou créer une équipe</li>
                <li>- Afficher votre profil et votre nom d'utilisateur dans l'application</li>
                <li>- Assurer la sécurité de votre espace personnel</li>
              </ul>
            </div>
            <div class="h-px bg-white/10 my-1" />
            <div>
              <h3 class="font-semibold text-white mb-1">Base légale</h3>
              <p class="text-white/70 text-sm leading-relaxed">
                Le traitement repose sur votre <strong class="text-white">consentement explicite</strong> (article 6.1.a du RGPD), exprimé lors de la création de votre compte via la case à cocher de consentement.
              </p>
            </div>
          </div>
        </section>

        <!-- 5. Durée de conservation -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            5. Durée de conservation
          </h2>
          <p class="text-white/80 leading-relaxed">
            Vos données sont conservées <strong class="text-white">tant que votre compte est actif</strong>. En cas de suppression de votre compte, vos données personnelles (nom d'utilisateur, e-mail, avatar) sont supprimées dans un délai raisonnable.
          </p>
          <p class="text-white/60 text-sm mt-3 leading-relaxed">
            Certaines données liées à votre participation dans des équipes (ex : historique de tournoi) peuvent être conservées sous forme anonymisée à des fins de traçabilité de l'événement.
          </p>
        </section>

        <!-- 6. Hébergement et destinataires -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            6. Hébergement et destinataires des données
          </h2>
          <p class="text-white/80 leading-relaxed">
            Les données sont stockées sur une instance <strong class="text-white">PocketBase auto-hébergée</strong> par le responsable du traitement.
          </p>
          <div class="mt-4 bg-primary/10 border border-primary/20 rounded-xl px-5 py-4">
            <p class="text-white font-semibold text-sm mb-1">Aucune transmission à des tiers</p>
            <p class="text-white/60 text-sm leading-relaxed">
              Vos données ne sont ni vendues, ni partagées, ni transmises à des entreprises tierces, des partenaires commerciaux ou des régies publicitaires. Elles restent exclusivement sur notre infrastructure.
            </p>
          </div>
          <p class="text-white/50 text-sm mt-3 leading-relaxed">
            Serveur hébergé par : <span class="text-white/70">Netlify</span>
          </p>
        </section>

        <!-- 7. Sécurité -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            7. Sécurité des données
          </h2>
          <p class="text-white/80 leading-relaxed">
            Des mesures techniques sont mises en place pour protéger vos données :
          </p>
          <ul class="mt-4 text-white/70 text-sm flex flex-col gap-2 leading-relaxed">
            <li>- Mots de passe hachés (bcrypt), jamais stockés en clair</li>
            <li>- Accès aux données utilisateur restreint au seul propriétaire du compte (règles PocketBase)</li>
            <li>- Connexion sécurisée via HTTPS</li>
            <li>- Authentification par token à durée limitée</li>
          </ul>
          <p class="text-white/50 text-sm mt-4 leading-relaxed">
            Ce site est un projet étudiant. Bien que des précautions sérieuses soient prises, nous vous recommandons de ne pas utiliser un mot de passe commun à d'autres services.
          </p>
        </section>

        <!-- 8. Droits des utilisateurs -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            8. Vos droits
          </h2>
          <p class="text-white/80 leading-relaxed mb-5">
            Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-white/5 rounded-xl p-4">
              <p class="font-semibold text-white text-sm">Droit d'accès</p>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Obtenir une copie des données vous concernant.</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <p class="font-semibold text-white text-sm">Droit de rectification</p>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Corriger des données inexactes ou incomplètes.</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <p class="font-semibold text-white text-sm">Droit à l'effacement</p>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Demander la suppression de votre compte et de vos données.</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <p class="font-semibold text-white text-sm">Droit d'opposition</p>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Vous opposer à un traitement dans les cas prévus par le RGPD.</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <p class="font-semibold text-white text-sm">Droit à la portabilité</p>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Recevoir vos données dans un format lisible et structuré.</p>
            </div>
            <div class="bg-white/5 rounded-xl p-4">
              <p class="font-semibold text-white text-sm">Droit au retrait du consentement</p>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">Retirer votre consentement à tout moment, sans effet rétroactif.</p>
            </div>
          </div>
        </section>

        <!-- 9. Exercer ses droits -->
        <section class="bg-primary/15 border border-primary/30 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-white">
            9. Comment exercer vos droits ?
          </h2>
          <p class="text-white/80 leading-relaxed">
            Pour toute demande concernant vos données personnelles, contactez-nous par e-mail à l'adresse suivante :
          </p>
          <a
            href="mailto:mathis.guellati@gmail.com"
            class="inline-block mt-4 bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-3 rounded-full text-white text-sm transition-all hover:scale-105"
          >
            mathis.guellati@gmail.com
          </a>
          <p class="text-white/50 text-sm mt-5 leading-relaxed">
            Nous nous engageons à répondre à votre demande dans un délai maximum de <strong class="text-white/70">30 jours</strong> suivant sa réception. Si vous estimez que vos droits ne sont pas respectés, vous pouvez également saisir la <strong class="text-white/70">CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) à l'adresse <span class="text-white/70">www.cnil.fr</span>.
          </p>
        </section>

        <!-- 10. Cookies -->
        <section class="bg-white/5 border border-white/10 rounded-2xl p-7">
          <h2 class="font-montserratAlt font-bold text-xl mb-4 text-primary">
            10. Cookies et stockage local
          </h2>
          <p class="text-white/80 leading-relaxed">
            Ce site utilise le <strong class="text-white">stockage local du navigateur</strong> (localStorage) uniquement pour maintenir votre session de connexion active. Aucun cookie de tracking, publicitaire ou analytique n'est utilisé.
          </p>
        </section>

      </div>

      <!-- Séparateur -->
      <div class="h-px bg-white/10 my-12" />

      <!-- Mentions légales éditeur -->
      <div class="text-white/40 text-sm leading-relaxed flex flex-col gap-1">
        <p class="font-montserratAlt font-bold text-white/60 mb-2">Informations éditeur</p>
        <p>Éditeur : CAPS - Association étudiante MMI, IUT de Montbéliard</p>
        <p>Responsable de publication : Mathis Guellati</p>
        <p>Hébergement : <span class="text-white/50">Netlify</span></p>
        <p class="mt-2 text-xs">Ce site est un projet étudiant sans but lucratif.</p>
      </div>

    </div>
  </div>
</template>
