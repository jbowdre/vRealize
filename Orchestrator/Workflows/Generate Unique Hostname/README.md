# Generate Unique Hostname workflow
Ensures a unique, sequentially-numbered hostname by checking for naming conflicts in vCenter, DNS, and Active Directory.

## Inputs/Outputs
| Name | Type | Direction | Description |
|:--- |:--- |:---|:---|
| `nameBase` | string | Input | letter-based portion of the VM naming format |
| `domain` | string | Input | domain name for checking DNS conflicts |
| `digits` | number | Input | optional manually-specified numbering suffix; overrides automatic numbering but still checks for conflicts |
| `vCenterName` | string | Input | FQDN of the owning vCenter |
| `vmName` | string | Output | generated VM name |

