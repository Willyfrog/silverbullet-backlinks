# SilverBullet plug for Github
Provides Github events and pull requests as query sources using SB's `<!-- #query -->` mechanism.

## Configuration
This step is optional, but without it you may be rate limited by the Github API,

To configure, create a page `github-config` in your space with the following configuration, where `token` should be a [personal access token](https://github.com/settings/tokens):

        ```meta
        token: your-github-token
        ```

## Query sources

* `gh-events` required filters in the `where` clause:
    * `username`: the user whose events to query
* `gh-pulls`
    * `repo`: the repo to query PRs for

## Example

Example uses:

        # Recent pushes
        <!-- #query gh-events where username = "zefhemel" and type = "PushEvent" select username, date, ref, size order by date desc limit 5 -->
        <!-- /query -->

        ## Recent PRs
        <!-- #query gh-pulls where repo = "silverbulletmd/silverbullet" and username = "zefhemel" -->
        <!-- /query -->
        