# Intégrer le simulateur d'éligibilité Boris sur un site OFS

Ce guide explique comment afficher le simulateur d'éligibilité Boris sur le site d'un OFS. Le simulateur intégré reprend le parcours Boris existant : résultat d'éligibilité, explications, puis saisie des coordonnées pour créer une ligne de contact visible dans l'espace OFS.

## Avant de commencer

Demandez à l'équipe Boris d'autoriser l'origine de votre site, par exemple :

```txt
https://www.votre-ofs.fr
```

L'autorisation se fait par origine, pas par page. Une fois l'origine autorisée, les lignes de contact créées depuis le simulateur intégré seront attribuées à votre OFS.

## Intégration recommandée

Ajoutez un conteneur et le script d'intégration sur la page où le simulateur doit apparaître :

```html
<div id="boris-simulateur-eligibilite"></div>

<script
  src="https://boris.beta.gouv.fr/embed/simulateur-eligibilite.js"
  data-container="boris-simulateur-eligibilite">
</script>
```

Le script crée l'iframe et ajuste automatiquement sa hauteur. Il transmet aussi automatiquement l'origine de votre site à Boris.

## Exemple avec paramètres

```html
<div id="boris-simulateur-eligibilite"></div>

<script
  src="https://boris.beta.gouv.fr/embed/simulateur-eligibilite.js"
  data-container="boris-simulateur-eligibilite"
  data-partner-name="OFS Exemple"
  data-primary-color="#0053b3"
  data-logo-url="https://www.votre-ofs.fr/logo.svg"
  data-selection-departments="75,92"
  data-intro="compact">
</script>
```

## Paramètres disponibles

| Paramètre | Description | Exemple |
| --- | --- | --- |
| `partnerName` | Nom court affiché dans le simulateur. | `OFS Exemple` |
| `primaryColor` | Couleur principale au format hexadécimal. | `#0053b3` |
| `logoUrl` | URL HTTPS d'un logo hébergé sur la même origine autorisée que la page d'intégration. | `https://www.votre-ofs.fr/logo.svg` |
| `hideBorisBranding` | Masque la marque Boris lorsque la valeur vaut `true`. | `true` |
| `intro` | Variante d'introduction : `default`, `compact` ou `none`. | `compact` |
| `selectionDepartments` | Limite les lieux sélectionnables à une liste de codes départements. | `75,92` |
| `selectionCitycodes` | Limite les lieux sélectionnables à une liste de codes INSEE de communes. | `75056,92012` |

Les paramètres changent uniquement la présentation ou le parcours. Ils ne changent pas les règles d'éligibilité et ne déterminent pas l'OFS destinataire des lignes de contact.

## Limiter les lieux sélectionnables

Pour limiter le simulateur à certains départements :

```html
<script
  src="https://boris.beta.gouv.fr/embed/simulateur-eligibilite.js"
  data-container="boris-simulateur-eligibilite"
  data-selection-departments="44,49">
</script>
```

Pour limiter le simulateur à certaines communes :

```html
<script
  src="https://boris.beta.gouv.fr/embed/simulateur-eligibilite.js"
  data-container="boris-simulateur-eligibilite"
  data-selection-citycodes="44109,49007">
</script>
```

Les codes départements et codes INSEE servent uniquement à limiter les choix proposés à l'utilisateur. L'attribution des lignes de contact reste déterminée par l'origine autorisée du site.

## Intégration iframe seule

L'iframe seule est possible, mais le script est recommandé. Avec une iframe seule, vous devez renseigner explicitement `parentOrigin` :

```html
<iframe
  src="https://boris.beta.gouv.fr/embed/simulateur-eligibilite?parentOrigin=https%3A%2F%2Fwww.votre-ofs.fr&intro=compact"
  style="width: 100%; height: 900px; border: 0;"
  loading="lazy">
</iframe>
```

Cette méthode ne redimensionne pas automatiquement l'iframe.

## Paramètres non pris en charge

Les paramètres suivants ne sont pas pris en charge :

- `ofsId`
- `source`
- `customCssUrl`
- `completionUrl` ou `redirectUrl`
- texte de consentement personnalisé
- règles ou seuils d'éligibilité personnalisés
- destination API personnalisée

## Problèmes fréquents

**Le simulateur affiche une erreur d'autorisation**

Vérifiez que l'origine exacte du site a été autorisée par Boris. `https://www.votre-ofs.fr` et `https://votre-ofs.fr` sont deux origines différentes.

**Le logo ne s'affiche pas**

Le logo doit être accessible en HTTPS et hébergé sur la même origine autorisée que la page qui intègre le simulateur.

**L'iframe est trop grande ou trop petite**

Utilisez le script d'intégration recommandé. Il ajuste automatiquement la hauteur de l'iframe.

**Les contacts n'apparaissent pas dans l'espace OFS**

Vérifiez que la page est bien servie depuis une origine autorisée. Les lignes de contact sont attribuées à l'OFS associé à cette origine.
