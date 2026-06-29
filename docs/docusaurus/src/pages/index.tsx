/* eslint-disable canonical/filename-no-index -- Docusaurus requires src/pages/index.tsx for the site homepage route. */
import type { JSX } from "react";

import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import GitHubStats from "../components/git-hub-stats";
import styles from "./index.module.css";

interface HeroBadge {
    readonly description: string;
    readonly label: string;
}

interface HeroStat {
    readonly description: string;
    readonly headline: string;
}

interface HomeCard {
    readonly actionLabel: string;
    readonly bullets: readonly string[];
    readonly description: string;
    readonly icon: string;
    readonly title: string;
    readonly to: string;
}

const heroBadges = [
    {
        description:
            "Flat config exports for ESLint v9+ and current TypeScript projects.",
        label: "Flat Config native",
    },
    {
        description:
            "Runs Tombi without hiding its native diagnostics, formatting, or configuration model.",
        label: "Tombi bridge",
    },
    {
        description:
            "Caches remote schemas and catalogs for 30 days by default during ESLint runs.",
        label: "Schema cache",
    },
] as const satisfies readonly HeroBadge[];

const heroStats = [
    {
        description: "Runs Tombi over TOML files through ESLint.",
        headline: "Tombi bridge",
    },
    {
        description: "Split lint, check, and format jobs when CI needs it.",
        headline: "6 Presets",
    },
    {
        description: "Default cache TTL for remote schemas and catalogs.",
        headline: "30 Days",
    },
] as const satisfies readonly HeroStat[];

const packageName = "eslint-plugin-tombi";
const homepageDescription =
    "Run Tombi from ESLint, report TOML lint and format diagnostics in the same editor and CI stream, and keep schema cache behavior under control.";
const homepageKeywords =
    "eslint, eslint-plugin, tombi, toml linting, toml formatting, flat config";
const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    codeRepository: `https://github.com/Nick2bad4u/${packageName}`,
    description: homepageDescription,
    image: `https://nick2bad4u.github.io/${packageName}/img/logo.png`,
    license: `https://github.com/Nick2bad4u/${packageName}/blob/main/LICENSE`,
    name: packageName,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    url: `https://nick2bad4u.github.io/${packageName}/`,
} as const;
const homepageSocialImageUrl = `https://nick2bad4u.github.io/${packageName}/img/logo.png`;

const homeCards = [
    {
        actionLabel: "Start setup",
        bullets: [
            "Add the flat-config preset",
            "Target TOML files",
            "Keep Tombi config native",
        ],
        description:
            "Install the plugin, enable a preset, and pass through only the upstream options you need.",
        icon: "📄",
        title: "Get Started",
        to: "/docs/rules/getting-started",
    },
    {
        actionLabel: "Compare presets",
        bullets: [
            "🟡 Recommended TOML checks",
            "🚦 Lint-only jobs",
            "🔧 Format-fix jobs",
        ],
        description:
            "Compare recommended, lint-only, check-only, format-only, and alias presets.",
        icon: "🛠️",
        title: "Presets",
        to: "/docs/rules/presets",
    },
    {
        actionLabel: "Browse rules",
        bullets: [
            "TOML diagnostics",
            "Format checks",
            "Schema cache options",
        ],
        description:
            "Browse the bridge rule with concrete ESLint and Tombi examples.",
        icon: "📜",
        title: "Rule Reference",
        to: "/docs/rules",
    },
] as const satisfies readonly HomeCard[];

export default function Home(): JSX.Element {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            description={homepageDescription}
            title="TOML diagnostics inside ESLint"
        >
            <Head>
                <meta content={homepageKeywords} name="keywords" />
                <meta content={homepageSocialImageUrl} property="og:image" />
                <meta content="summary_large_image" name="twitter:card" />
                <meta content={homepageSocialImageUrl} name="twitter:image" />
                <script type="application/ld+json">
                    {JSON.stringify(homepageStructuredData)}
                </script>
            </Head>
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div>
                            <p className={styles.heroKicker}>
                                ESLint bridge for Tombi
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                {packageName}
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                {homepageDescription}
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        className={styles.heroBadge}
                                        key={badge.label}
                                    >
                                        <p className={styles.heroBadgeLabel}>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/overview"
                                >
                                    Start with Overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/presets"
                                >
                                    Compare Presets
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt={`${packageName} logo`}
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                className={styles.heroStatCard}
                                key={stat.headline}
                            >
                                <p className={styles.heroStatHeading}>
                                    {stat.headline}
                                </p>
                                <p className={styles.heroStatDescription}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.cardGrid}>
                        {homeCards.map((card) => (
                            <article className={styles.card} key={card.title}>
                                <div className={styles.cardHeader}>
                                    <span
                                        aria-hidden="true"
                                        className={styles.cardIcon}
                                    >
                                        {card.icon}
                                    </span>
                                    <Heading
                                        as="h2"
                                        className={styles.cardTitle}
                                    >
                                        {card.title}
                                    </Heading>
                                </div>
                                <p className={styles.cardDescription}>
                                    {card.description}
                                </p>
                                <ul className={styles.cardBullets}>
                                    {card.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                                <Link className={styles.cardLink} to={card.to}>
                                    {card.actionLabel}
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}

/* eslint-enable canonical/filename-no-index -- Re-enable after Docusaurus homepage module. */
