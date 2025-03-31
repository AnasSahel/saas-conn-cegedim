---
title: 'Cegedim SailPoint SaaS Connector'
---

# Cegedim Connector for SaaS Connectivity

This is a SailPoint SaaS Connector that connects to `Cegedim` **HR**

## How to use

Start by downloading the zip file from the [release page](https://github.com/AnasSahel/saas-conn-cegedim/releases)

Once downloaded, you can upload the connector to your organization tenant by using the `SailPoint` cli

1. Create the connector `sail conn create "saas-conn-cegedim"``
2. Upload the connector `sail conn upload -c "saas-conn-cegedim" -f "/path/to/connector.zip"`

## Configuration

The connector requires the following configuration parameters:

### Authentication

-   **Endpoint**: The URL of the Cegedim web service.
-   **Client Code**: The client code provided by Cegedim.
-   **Client Secret**: The secret key provided by Cegedim for secure communication.
-   **Client ID**: The ID used to authenticate with the Cegedim web service.
-   **Client Password**: The password used to authenticate with the Cegedim web service.

### Date Range

-   **Minimum Months Before Today**: Specify the minimum months before today for employee contract retrieval.
-   **Maximum Months After Today**: Specify the maximum months after today for employee contract retrieval.

### Pagination

-   **Page Size (number of contracts in total)**: Specify the page size for retrieving employee contracts.
-   **Number of iterations to retrieve all contracts or to stop at (watch out for performance)**: Specify the number of iterations to retrieve all contracts or to stop at.
