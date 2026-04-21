# Outstand Instagram Feed

> Display Instagram posts using a customizable Gutenberg block with list and grid layouts.

## Description

A WordPress plugin that connects to the Instagram API to display your Instagram posts in the block editor. It handles OAuth authentication, automatic token refresh, and provides modular blocks for media and captions with full layout and styling controls.

The icons are from [Themify Icons](https://themify.me/themify-icons).

![Outstand Instagram Feed](assets/demo.gif)

## Features

- **OAuth Authentication**: Connects to the Instagram API with automatic long-lived token refresh
- **List and Grid Layouts**: Choose how your feed is displayed
- **Modular Blocks**: Separate blocks for media, captions, and post templates
- **Full Styling Support**: Colors, typography, spacing, borders, and overlay controls
- **Built-in Caching**: 5-minute transient cache for optimal performance

## Installation

### Manual Installation

1. Download the plugin ZIP file from the GitHub repository.
2. Go to Plugins > Add New > Upload Plugin in your WordPress admin area.
3. Upload the ZIP file and click Install Now.
4. Activate the plugin.

### Install with Composer

To include this plugin as a dependency in your Composer-managed WordPress project:

1. Add the plugin to your project using the following command:

```bash
composer require outstand/instagram-feed
```

1. Run `composer install` to install the plugin.
2. Activate the plugin from your WordPress admin area or using WP-CLI.

## Setup

> You'll connect your Instagram Business or Creator account to your website using a Facebook App. This allows the plugin to fetch and display your Instagram feed securely.

### Account Requirements

- Your Instagram account must be a **Business** or **Creator** account
- To convert your account: [How to switch to a professional Instagram account](https://help.instagram.com/502981923235522)

### Step 1: Register a Facebook App

All Instagram API access goes through the Facebook Developers platform. You'll create a Facebook App, connect it to your Instagram Business or Creator account, and configure an OAuth redirect URL for this plugin.

See [docs/application-setup.md](docs/application-setup.md) for a step-by-step, screenshot-by-screenshot walk-through. When you finish that doc you will have an **Instagram App ID**, an **Instagram App Secret**, and an accepted Instagram Tester invitation — return here and continue below.

### Step 2: Configure Plugin

1. Go to **Settings > Outstand Instagram Feed** in your WordPress admin
2. Enter your **Instagram App ID** and **Instagram App Secret** and click **Save**
3. Click **Connect Instagram Account**
4. You will be redirected to Instagram where you can log in with your username and password
5. After login, you will see a permissions window. The only permission required is **View profile and access media**. All others you can leave unchanged or toggle off.
6. Click **Allow**
7. You'll be redirected back to WordPress. Your connection will appear as **Connected** in the plugin settings.

### Step 3: Add the Block

1. In the block editor, search for "Instagram Feed"
2. Add the block to your page or post
3. Configure the number of posts to display
4. Choose your preferred layout (list or grid)

## Usage

### Instagram Feed

The main block controls the overall feed settings:

- **Number of Posts**: Set how many Instagram posts to display (1-50)
- **Layout**: Choose between list and grid layouts
- **Alignment**: Support for wide and full-width alignments

### Child Blocks

- **Post Template**: Container for individual Instagram posts with full layout and styling support
- **Post Media**: Displays the Instagram image with link, dimension, overlay, border, and shadow controls
- **Post Caption**: Shows the post caption with heading level, alignment, link, and typography options

## Requirements

- WordPress 6.7 or higher
- PHP 8.2 or higher
- Instagram **Business** or **Creator** account
- Facebook Developer account with Instagram product configured

## Changelog

All notable changes to this project are documented in [CHANGELOG.md](https://github.com/pixelalbatross/outstand-instagram-feed/blob/main/CHANGELOG.md).

## License

This project is licensed under the [GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later.html).
