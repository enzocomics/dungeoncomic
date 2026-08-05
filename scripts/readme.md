## Extracting the Directus Template

**_TODO_**: _automate this somehow_

After you extract the Directus Template, you need to edit a couple of files in `/cms/directus-template/src/`:

- `access.json`: compare the values of `policy` and find the ones that match the administrator & public policies, and delete them
- `roles.json`: delete the administrator role (Directus installs it by default)
- `policies.json`: delete the administrator & public policies (Directus installs it by default)

**_TODO_**: _this shouldn't be hardcoded_

- `/scripts/set-defaults.sh`: make sure the value of `public_registration_role` matches the UUID defined in `/cms/directus-template/src/roles.json`
