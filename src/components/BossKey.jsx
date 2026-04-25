export default function BossKey({ onClose }) {
  return (
    <div className="bosskey-overlay" id="bosskey-screen" onClick={onClose}>
      <div className="bosskey-title">
        ═══════════════════════════════════════════════════════════════
        <br />
        {'                    SYSTEM INFORMATION'}
        <br />
        ═══════════════════════════════════════════════════════════════
      </div>

      <div className="bosskey-section">
        <span className="bosskey-label">OS Name:                  </span>
        <span className="bosskey-value">Microsoft Windows 10 Education</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">OS Version:               </span>
        <span className="bosskey-value">10.0.19045 N/A Build 19045</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">OS Manufacturer:          </span>
        <span className="bosskey-value">Microsoft Corporation</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">System Manufacturer:      </span>
        <span className="bosskey-value">Dell Inc.</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">System Model:             </span>
        <span className="bosskey-value">OptiPlex 3080</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">System Type:              </span>
        <span className="bosskey-value">x64-based PC</span>
      </div>

      <div className="bosskey-divider">
        ───────────────────────────────────────────────────────────────
      </div>

      <div className="bosskey-section">
        <span className="bosskey-label">Processor(s):             </span>
        <span className="bosskey-value">1 Processor(s) Installed.</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">{'                          '}</span>
        <span className="bosskey-value">[01]: Intel(R) Core(TM) i5-10500 CPU @ 3.10GHz</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">BIOS Version:             </span>
        <span className="bosskey-value">Dell Inc. 2.9.0, 15/07/2022</span>
      </div>

      <div className="bosskey-divider">
        ───────────────────────────────────────────────────────────────
      </div>

      <div className="bosskey-section">
        <span className="bosskey-label">Total Physical Memory:    </span>
        <span className="bosskey-value">8,192 MB</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">Available Physical Memory:</span>
        <span className="bosskey-value"> 4,287 MB</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">Virtual Memory: Max Size: </span>
        <span className="bosskey-value">16,384 MB</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">Virtual Memory: In Use:   </span>
        <span className="bosskey-value">6,142 MB</span>
      </div>

      <div className="bosskey-divider">
        ───────────────────────────────────────────────────────────────
      </div>

      <div className="bosskey-section">
        <span className="bosskey-label">Domain:                   </span>
        <span className="bosskey-value">COLLEGE-LAB</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">Logon Server:             </span>
        <span className="bosskey-value">\\LABSERVER01</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">Network Card(s):          </span>
        <span className="bosskey-value">1 NIC(s) Installed.</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">{'                          '}</span>
        <span className="bosskey-value">[01]: Intel(R) Ethernet Connection I219-LM</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">{'                          '}</span>
        <span className="bosskey-value">      Connection Name: Ethernet</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">{'                          '}</span>
        <span className="bosskey-value">      DHCP Enabled:    Yes</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">{'                          '}</span>
        <span className="bosskey-value">      IP address(es)</span>
      </div>
      <div className="bosskey-section">
        <span className="bosskey-label">{'                          '}</span>
        <span className="bosskey-value">      [01]: 192.168.1.105</span>
      </div>

      <div className="bosskey-divider">
        ───────────────────────────────────────────────────────────────
      </div>

      <div className="bosskey-section">
        <span className="bosskey-label">Hyper-V Requirements:     </span>
        <span className="bosskey-value">A hypervisor has been detected.</span>
      </div>

      <div style={{ marginTop: '20px', color: '#555555' }}>
        Press ESC to return...
      </div>
    </div>
  );
}
