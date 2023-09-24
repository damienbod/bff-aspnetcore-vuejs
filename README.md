# bff-aspnetcore-vuejs

[![.NET and npm build](https://github.com/damienbod/bff-aspnetcore-vuejs/actions/workflows/dotnet.yml/badge.svg)](https://github.com/damienbod/bff-aspnetcore-vuejs/actions/workflows/dotnet.yml) [![License](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://github.com/damienbod/bff-aspnetcore-vuejs/blob/main/LICENSE)

## Setup Server 

The ASP.NET Core project is setup to run in development and production. In production, it uses the Angular production build deployed to the wwwroot. In development, it uses MS YARP reverse proxy to forward requests.

> [!IMPORTANT]  
> In production, the Angular nx project is built into the **wwwroot** of the .NET project.

![BFF production](https://github.com/damienbod/bff-aspnetcore-angular/blob/main/images/bff-arch-production_01.png)

Configure the YARP reverse proxy to match the Angular nx URL. This is only required in development. I always use HTTPS in development and the port needs to match the Angular nx developement env.

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

## Links

https://vitejs.dev/

https://www.koderhq.com/tutorial/vue/vite/

https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core

https://nx.dev/getting-started/intro

https://github.com/AzureAD/microsoft-identity-web

https://github.com/isolutionsag/aspnet-react-bff-proxy-example

https://github.com/damienbod/bff-aspnetcore-angular

https://github.com/damienbod/bff-auth0-aspnetcore-angular