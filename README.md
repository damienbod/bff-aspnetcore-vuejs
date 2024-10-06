# bff-aspnetcore-vuejs

[![.NET and npm build](https://github.com/damienbod/bff-aspnetcore-vuejs/actions/workflows/dotnet.yml/badge.svg)](https://github.com/damienbod/bff-aspnetcore-vuejs/actions/workflows/dotnet.yml) [![Build and deploy to Azure Web App](https://github.com/damienbod/bff-aspnetcore-vuejs/actions/workflows/azure-webapps-dotnet-core.yml/badge.svg)](https://github.com/damienbod/bff-aspnetcore-vuejs/actions/workflows/azure-webapps-dotnet-core.yml) [![License](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://github.com/damienbod/bff-aspnetcore-vuejs/blob/main/LICENSE)

[Implement a secure web application using Vue.js and an ASP.NET Core server](https://damienbod.com/2023/10/02/implement-a-secure-web-application-using-vue-js-and-an-asp-net-core-server/)

## Setup Server 

The ASP.NET Core project is setup to run in development and production. In production, it uses the Vue.js production build deployed to the wwwroot. In development, it uses MS YARP reverse proxy to forward requests.

> [!IMPORTANT]  
> In production, the Vue.js project is built into the **wwwroot** of the .NET project.

![BFF production](https://github.com/damienbod/bff-aspnetcore-vuejs/blob/main/images/vue-aspnetcore-bff_01.png)

Configure the YARP reverse proxy to match the Vue.js URL. This is only required in development. I always use HTTPS in development and the port needs to match the Vue.js developement env (vite.config.js).

```json
 "UiDevServerUrl": "https://localhost:4201",
  "ReverseProxy": {
    "Routes": {
      "route1": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "{**catch-all}"
        }
      }
    },
    "Clusters": {
      "cluster1": {
        "HttpClient": {
          "SslProtocols": [
            "Tls12"
          ]
        },
        "Destinations": {
          "cluster1/destination1": {
            "Address": "https://localhost:4201/"
          }
        }
      }
    }
  }
```


## Setup Vue.js Vite project

Add the certificates to the nx project for example in the **/certs** folder

Update the vite.config.ts file:

```typescipt
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync('./certs/dev_localhost.key'),
      cert: fs.readFileSync('./certs/dev_localhost.pem'),
	},
    port: 4202,
    strictPort: true, // exit if port is in use
    hmr: {
      clientPort: 4202, // point vite websocket connection to vite directly, circumventing .net proxy
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    outDir: "../server/wwwroot",
    emptyOutDir: true
  },
})
```


> [!NOTE]  
> The ASP.NET Core project setup uses port 4202, this needs to match the YARP reverse proxy settings for development.


## Setup development

The development environment is setup to use the defualt tools for each of the tech stacks. Vue.js is used like recommended. I use Visual Studio code. A YARP reverse proxy is used to integrate the Vue.js development into the backend application.

![BFF development](https://github.com/damienbod/bff-aspnetcore-vuejs/blob/main/images/vue-aspnetcore-bff-yarp-dev_01.png)

> [!NOTE]  
> Always run in HTTPS, both in development and production

```
npm start
```

## Azure App Registration setup

The application(s) are deployed as one. This is an OpenID Connect confidential client with a user secret or a certification for client assertion.

Use the Web client type on setup.

![BFF Azure registration](https://github.com/damienbod/bff-aspnetcore-angular/blob/main/images/azure-app-registration_01.png)

The OpenID Connect client is setup using **Microsoft.Identity.Web**. This implements the Microsoft Entra ID client. I have created downstream APIs using the OBO flow and a Microsoft Graph client. This could be replaced with any OpenID Connect client and requires no changes in the frontend part of the solution.

```csharp
var scopes = configuration.GetValue<string>("DownstreamApi:Scopes");
string[] initialScopes = scopes!.Split(' ');

services.AddMicrosoftIdentityWebAppAuthentication(configuration, "MicrosoftEntraID")
    .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)
    .AddMicrosoftGraph("https://graph.microsoft.com/v1.0", initialScopes)
    .AddInMemoryTokenCaches();

services.AddControllersWithViews(options =>
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));

services.AddRazorPages().AddMvcOptions(options =>
{
    //var policy = new AuthorizationPolicyBuilder()
    //    .RequireAuthenticatedUser()
    //    .Build();
    //options.Filters.Add(new AuthorizeFilter(policy));
}).AddMicrosoftIdentityUI();
```

Add the Azure App registration settings to the **appsettings.Development.json** and the **ClientSecret** to the user secrets.

```json
"MicrosoftEntraID": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "[Enter the domain of your tenant, e.g. contoso.onmicrosoft.com]",
    "TenantId": "[Enter 'common', or 'organizations' or the Tenant Id (Obtained from the Azure portal. Select 'Endpoints' from the 'App registrations' blade and use the GUID in any of the URLs), e.g. da41245a5-11b3-996c-00a8-4d99re19f292]",
    "ClientId": "[Enter the Client Id (Application ID obtained from the Azure portal), e.g. ba74781c2-53c2-442a-97c2-3d60re42f403]",
    "ClientSecret": "[Copy the client secret added to the app from the Azure portal]",
    "ClientCertificates": [
    ],
    // the following is required to handle Continuous Access Evaluation challenges
    "ClientCapabilities": [ "cp1" ],
    "CallbackPath": "/signin-oidc"
},
```

App Service (linux plan) configuration 

```
MicrosoftEntraID__Instance               --your-value--
MicrosoftEntraID__Domain                 --your-value--
MicrosoftEntraID__TenantId               --your-value--
MicrosoftEntraID__ClientId               --your-value--
MicrosoftEntraID__CallbackPath           /signin-oidc
MicrosoftEntraID__SignedOutCallbackPath  /signout-callback-oidc
```

The client secret or client certificate needs to be setup, see Microsoft Entra ID documentation.

## Debugging

Start the Vue.js project from the **ui** folder

```
npm start
```

Start the ASP.NET Core project from the **server** folder

```
dotnet run
```

Or just open Visual Studio and run the solution.

## github actions build

Github actions is used for the DevOps. The build pipeline builds both the .NET project and the Vue.js project using npm. The two projects are built in the same step because the UI project is built into the wwwroot of the server project.

```yaml

name: .NET and npm build

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 8.0.x

      - name: Restore dependencies
        run: dotnet restore

      - name: npm setup
        working-directory: ui
        run: npm install

      - name: ui-build
        working-directory: ui
        run: npm run build

      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build --verbosity normal
```

## github actions Azure deployment

The deployment pipeline builds both projects and deployes this to Azure using an Azure App Service. See **azure-webapps-dotnet-core.yml**

deployment test server: https://bff-vue-aspnetcore.azurewebsites.net/

## Credits and used libraries

- NetEscapades.AspNetCore.SecurityHeaders
- Yarp.ReverseProxy
- Microsoft.Identity.Web
- ASP.NET Core
- Vue.js
- Vite

## Links

https://vuejs.org/

https://vitejs.dev/

https://github.com/vuejs/create-vue

https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core

https://github.com/AzureAD/microsoft-identity-web

https://www.koderhq.com/tutorial/vue/vite/

https://github.com/isolutionsag/aspnet-react-bff-proxy-example

https://github.com/damienbod/bff-aspnetcore-angular

https://github.com/damienbod/bff-auth0-aspnetcore-angular

https://github.com/damienbod/bff-openiddict-aspnetcore-angular

https://github.com/damienbod/bff-azureadb2c-aspnetcore-angular

https://github.com/damienbod/bff-MicrosoftEntraExternalID-aspnetcore-angular
