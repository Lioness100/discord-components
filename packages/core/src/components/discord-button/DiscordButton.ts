import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import type { DiscordButtonProps } from '../../types.js';
import { DiscordComponentsError } from '../../util.js';
import LaunchIcon from '../svgs/LaunchIcon.js';

@customElement('discord-button')
export class DiscordButton extends LitElement implements DiscordButtonProps {
	public static override readonly styles = css`
		:host > *:first-child {
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			margin: 4px 8px 4px 0;
			padding: 2px 16px;
			width: auto;
			height: 32px;
			min-width: 60px;
			min-height: 32px;
			-webkit-transition:
				background-color 0.17s ease,
				color 0.17s ease;
			transition:
				background-color 0.17s ease,
				color 0.17s ease;
			border-radius: 3px;
			font-size: 14px;
			font-weight: 500;
			line-height: 16px;
			text-decoration: none !important;
		}

		.success {
			color: #fff;
			background-color: #3ba55d;
		}

		.success.hoverable:hover {
			background-color: #2d7d46;
		}

		.destructive {
			color: #fff;
			background-color: #ed4245;
		}

		.destructive.hoverable:hover {
			background-color: #c03537;
		}

		.primary {
			color: #fff;
			background-color: #5865f2;
		}

		.primary.hoverable:hover {
			background-color: #4752c4;
		}

		.secondary {
			color: #fff;
			background-color: #4f545c;
		}

		.secondary.hoverable:hover {
			background-color: #5d6269;
		}

		.disabled {
			cursor: not-allowed !important;
			opacity: 0.5;
		}

		.launch {
			margin-left: 8px;
		}

		.emoji {
			margin-right: 4px;
			object-fit: contain;
			width: 1.375em;
			height: 1.375em;
			vertical-align: bottom;
		}
	`;

	/**
	 * The emoji URL to use in the button.
	 */
	@property({ reflect: true, attribute: 'emoji' })
	public accessor emoji: string;

	/**
	 * The name of the emoji used in the button.
	 */
	@property({ reflect: true, attribute: 'emoji-name' })
	public accessor emojiName = 'emoji';

	/**
	 * The URL for the button. Setting this will force the button type to be `secondary`.
	 */
	@property({ reflect: true, attribute: 'url' })
	public accessor url: string;

	/**
	 * Whether to show the button as disabled.
	 */
	@property({ type: Boolean, reflect: true, attribute: 'disabled' })
	public accessor disabled = false;

	/**
	 * The type of button this is, this will change the color of the button.
	 * Valid values: `primary`, `secondary`, `success`, `destructive`.
	 */
	@property({ reflect: true, attribute: 'type' })
	public accessor type: 'destructive' | 'primary' | 'secondary' | 'success' = 'secondary';

	private readonly validButtonTypes = new Set(['primary', 'secondary', 'success', 'destructive']);

	public checkType() {
		if (this.type) {
			if (typeof this.type !== 'string') {
				throw new TypeError('DiscordButton `type` prop must be a string.');
			} else if (!this.validButtonTypes.has(this.type)) {
				throw new RangeError("DiscordButton `type` prop must be one of: 'primary', 'secondary', 'success', 'destructive'");
			}
		}
	}

	public checkParentElement() {
		if (this.parentElement?.tagName.toLowerCase() !== 'discord-action-row') {
			throw new DiscordComponentsError('All <discord-button> components must be direct children of <discord-action-row>.');
		}
	}

	protected override render() {
		this.checkType();
		this.checkParentElement();

		const isActiveLinkButton = this.url && !this.disabled;

		const content = html`
			${when(this.emoji, () => html`<img src=${this.emoji} alt=${this.emojiName} draggable="true" class="emoji" />`)}
			<span>
				<slot></slot>
			</span>
			${when(this.url, () => LaunchIcon())}
		`;

		if (isActiveLinkButton) {
			return html`<a class="secondary" href=${this.url} target="_blank" rel="noopener noreferrer">${content}</a>`;
		}

		return html`<div
			class=${classMap({
				[this.type]: true,
				disabled: this.disabled,
				hoverable: !this.disabled
			})}
		>
			${content}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'discord-button': DiscordButton;
	}
}
