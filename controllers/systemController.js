const { Client } = require('ssh2');


function execCommand(conn, command) {
    return new Promise((resolve, reject) => {
        conn.exec(command, (err, stream) => {
            if (err) {
                reject(`Error executing command: ${command} - ${err}`);
                return;
            }

            let data = '';

            // Capture data in chunks as it arrives
            stream.on('data', (chunk) => {
                console.log(`Command Output (chunk by chunk):\n${chunk.toString()}\n`);
                data += chunk.toString();  // Convert buffer to string
            });

            // Resolve when the stream is closed
            stream.on('close', () => {
                resolve(data.trim());  // Trim whitespace from result
            });

            // Handle errors in the stream
            stream.on('error', (err) => {
                reject(`Error during command execution: ${err}`);
            });
        });
    });
}

async function getRemoteSystemInfo(host, username, password) {
    const conn = new Client();

    return new Promise((resolve, reject) => {
        conn.on('ready', async () => {
            console.log('SSH Connection established');
            
            const commands = [
                
                    ['uname -a', 'system_information'],
                    ['df -h', 'disk_usage'],
                    ['free -m', 'memory_usage'],
                    ['ss -tuln', 'ports_connections'],
                    ['ufw status', 'firewall_status'],
                    ['netstat -tunp', 'network_connections'],
                    ['dpkg -l', 'installed_packages_dpkg'], // For Debian/Ubuntu
                    ['rpm -qa', 'installed_packages_rpm'], // For Red Hat/CentOS
                    ['snap list', 'installed_snap_packages'], // For Snap packages
                    ['flatpak list', 'installed_flatpak_apps'], // For Flatpak apps
                    // ['node -v', 'node_version'],
                    ['python3 --version', 'python_version'],
                    ['java -version', 'java_version'],
                    ['npm -v', 'npm_version'],
                    ['pip3 --version', 'pip_version'],
                    ['gcc --version', 'gcc_version'],
                    ['git --version', 'git_version'],
                    ['docker --version', 'docker_version'],
                    ['go version', 'go_version'],
                    ['ruby --version', 'ruby_version'],
                    ['php --version', 'php_version'],        
            ];

            try {
                const results = [];
                for (let [command, description] of commands) {
                    console.log(`Running command: ${command}`);
                    const output = await execCommand(conn, command);

                    // Split each output into lines for better readability
                    results.push({ [description]: output.split('\n') });
                }

                conn.end();
                resolve(results);
            } catch (error) {
                conn.end();
                reject(`Error during command execution: ${error}`);
            }
        }).on('error', (err) => {
            reject(`SSH connection error: ${err}`);
        }).connect({
            host,
            port: 22,
            username,
            password
        });
    });
}

module.exports.main = async function main(req, res) {

    const host = req.body.host || '10.8.11.172';
    const username = req.body.username || 'shivanshu';
    const password = req.body.password || 'Shivanshu1572';

    try {
        console.log("Gathering System Information...");
        const data = await getRemoteSystemInfo(host, username, password);
        // Send as formatted JSON response
        res.send(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error gathering system information:", error);
        res.status(500).send({ error: "Failed to gather system information" });
    }
}
