import { FunctionalComponent } from "preact";

export const PrivacyPolicyExtension: FunctionalComponent = () => {
    return (
        <div class="homepage">
            <div class="homepage-content">
                <h1 class="homepage-title">Privacy Policy of the Unduck Helper extension</h1>
                <p class="homepage-description">
                    The Unduck Helper extension does not collect or transmit any user data to
                    external servers. All processing happens locally or on the visited website.
                </p>

                <div class="homepage-links">
                    <div class="searchbar-link">
                        <a href="/">Back to Home</a>
                    </div>
                </div>
            </div>
            <footer class="footer">
                <a href="https://github.com/HuckleberryLovesYou/unduck" target="_blank">
                    Unduck on GitHub
                </a>
                <span class="footer-separator">•</span>
                <a href="https://github.com/HuckleberryLovesYou/unduck-extension" target="_blank">
                    Unduck Helper extension on GitHub
                </a>
            </footer>
        </div>
    );
};
