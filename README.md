# ChatApp

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

Objectif de cette mise à jour: améliorer la structure d'une application de messagerie temps réel (architecture plus claire, services dédiés, modèles de données, et préparation aux WebSockets).

## Structure du code (principaux dossiers)

- src/app
  - app.ts, app.html, app.routes.ts
  - component/ ... composants UI existants (login, chats, chat-list, chat-detail, etc.)
  - model/ ... interfaces attendues par les composants existants (Conversation, Message, Group, User)
  - models/ ... modèles normalisés pour une future évolution (Chat, Message, UserRef)
  - service/
    - theme-service.ts
    - websocket-service.ts (nouveau) — encapsule la connexion WebSocket (connect, send, on, events$)
    - chat-service.ts (adapté) — expose l'API attendue par les composants (getConversations, getConversation, getMessages, sendMessage, sendFile, getUser, getUsers, getGroup) et prépare l'intégration temps réel

Cette organisation permet de conserver les composants existants tout en introduisant une base plus propre et extensible pour la messagerie temps réel.

## Démarrer le serveur de développement

```bash
ng serve
```

Ensuite, ouvrez votre navigateur sur `http://localhost:4200/`. L'application se rechargera automatiquement à chaque modification des fichiers sources.

## Génération de code

Pour générer un nouveau composant :

```bash
ng generate component component-name
```

Pour lister les schémas disponibles :

```bash
ng generate --help
```

## Build

```bash
ng build
```

Les artefacts seront dans `dist/`. Le build de production applique les optimisations par défaut.

## Tests unitaires

```bash
ng test
```

## E2E

Angular CLI n'installe pas d'outil e2e par défaut — choisissez la solution qui vous convient.

## Notes d'architecture

- WebSocketService centralise la connexion WebSocket et la diffusion d'événements typés.
- ChatService fournit une API simple pour les composants actuels (stockage en mémoire + événements WebSocket). Il pourra évoluer vers l'usage complet des modèles `models/`.
- Les interfaces de `model/` servent d'adaptateur pour ne pas casser le code existant pendant la transition vers une architecture feature/core/shared plus modulaire.
