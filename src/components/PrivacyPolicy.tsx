import { FunctionalComponent } from "preact";

export const PrivacyPolicy: FunctionalComponent = () => {
    return (
        <div class="homepage">
            <div class="homepage-content">
                <h1 class="homepage-title">Privacy Policy</h1>
                <p class="homepage-description">
                    This Website does not collect or transmit any user data to external servers. All
                    processing happens locally or on the visited website.
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
            </footer>
        </div>
    );
};
