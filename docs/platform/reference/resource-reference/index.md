---
sidebar_position: 4
title: Resources Reference
description: All Conduktor resources
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Admonition from '@theme/Admonition';

export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
    {children}
</span>
);

export const CLI = () => (
<Highlight color="#F8F1EE" text="#7D5E54">CLI</Highlight>
);

export const API = () => (
<Highlight color="#E7F9F5" text="#067A6F">API</Highlight>
);

export const TF = () => (
<Highlight color="#FCEFFC" text="#9C2BAD">Terraform</Highlight>
);

export const GUI = () => (
<Highlight color="#F6F4FF" text="#422D84">Console UI</Highlight>
);


export const AppToken = () => (
<Highlight color="#F0F4FF" text="#3451B2">Application Token</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin Token</Highlight>
);



The resources presented here can be managed from the CLI, the Public API, Terraform, or the Console UI.  
- CLI, Terraform and Public API uses an API Key to validate permissions.
- Console UI relies on RBAC model to validate what the user can do.

:::caution Work In Progress...
We're working hard to bring consistent experience using the CLI, API, and Console UI, but it is not the case today.
:::
We'll inform you about the availability matrix for each resource using the following labels: 
- <CLI />
- <API /> 
- <TF />
- <GUI />  


There are two kind of API Key to use with the CLI, Terraform and Public API:
- <AdminToken /> have all permissions over all resources in Console
- <AppToken /> permission are scoped to Application instances defined in Self Serve

In general, <AdminToken /> can bypass Application owners and "act" as an <AppToken />

