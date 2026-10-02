# Changelog

## [Unreleased]
### Changed
- Header matches the Block Explorer: the explorer tabs Nodes and Blockexplorer sit on the left next to the logo, search and network label on the right; same height, type, search icon and outline pill, so switching between the explorers no longer moves the header.

## [0.4.1] - 2026-07-06
### Added
- Detailed node modal and an enhanced peer table for richer per-node insights.

### Changed
- Upgraded to Angular 20 (ng-bootstrap 19, TypeScript 5.8, zone.js 0.15) on Node 22 build images; reproducible npm ci builds with committed package-lock.json.
- UI/styling consistency refinements.
- Production environment now uses a relative API URL, removing the unused Nginx API proxy configuration.

## [0.3.x and earlier]

# Release 0.3.3

# Release 0.3.2
- added readme
- added network to website title (mainnet/testnet)
- added connected column to table with date of last connection
- removed services column (Hallmark and API flag which are retrieved from services already have a column)
- Rearranged fields to group similar fields together in peer details
- fixed wrong labels in peer details
- adjusted service calls according to backend changes
- show MB instead of bytes for all memory etc. related fields
- changed icons to more clearly see what is enabled/disabled
- added several tooltips for additional peer information
- darkened color of text to make it easier to read
- disable toggling of list to avoid confusion if clicked accidentally
- added sync state column to list
- formatted dates with locale detection

# Release 0.3.1
- added a start script to npm to simplify usage to package.json
- resolve angular version manually
- Add missing jshintrc and prevent auto browser opening in docker container
- moved base app folder to root
- renamed npm package name
- added build docker script
- added dockerfile
- upgrade dependencies with high vulnerability, adjust gulpfile
- upgrade node sass and global gulp version
- added github action to build and publish a docke image to dockerhub
