<?php

namespace Outstand\WP\InstagramFeed;

class Cron {

	/**
	 * Refresh token hook name.
	 *
	 * @var string
	 */
	const REFRESH_TOKEN_HOOK = 'outstand_instagram_feed_refresh_access_token';

	/**
	 * Register any hooks and filters.
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', [ $this, 'schedule_events' ] );
		add_action( self::REFRESH_TOKEN_HOOK, [ $this, 'refresh_access_token' ] );
	}

	/**
	 * Schedule cron events.
	 *
	 * @return void
	 */
	public function schedule_events(): void {
		$plugin   = Plugin::get_instance();
		$settings = $plugin->get_settings();

		if ( $settings->get_auth_status() !== Settings::AUTH_STATUS_AUTHORIZED ) {
			wp_clear_scheduled_hook( self::REFRESH_TOKEN_HOOK );
		}
	}

	/**
	 * Refresh long-lived access token.
	 *
	 * @return void
	 */
	public function refresh_access_token(): void {
		$plugin       = Plugin::get_instance();
		$client       = $plugin->get_client();
		$settings     = $plugin->get_settings();
		$access_token = $settings->get_access_token();

		if ( empty( $access_token ) ) {
			$settings->set_auth_status( Settings::AUTH_STATUS_REAUTHORIZE );
			return;
		}

		$new_access_token = $client->refresh_access_token( $access_token );

		if ( is_wp_error( $new_access_token ) ) {
			$settings->set_auth_status( Settings::AUTH_STATUS_FAILED );
			return;
		}

		// Store the access token.
		$settings->set_access_token( $new_access_token );

		// Schedule token refresh (30 days from now).
		wp_schedule_single_event( strtotime( '+30 days' ), self::REFRESH_TOKEN_HOOK );
	}
}
