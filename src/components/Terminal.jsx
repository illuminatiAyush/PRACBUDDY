import { useState, useRef, useEffect } from 'react';
import TitleBar from './TitleBar';
import HotkeyBar from './HotkeyBar';

// Assembly files with actual code content
const ASM_FILES_DB = {
  'add_2nums_8086': `; Add two 8-bit numbers\n; 8086 Assembly Program\n.MODEL SMALL\n.CODE\nORG 100H\n\nMAIN:\n    MOV AL, 05H    ; Load first number\n    MOV BL, 03H    ; Load second number\n    ADD AL, BL     ; Add AL and BL\n    MOV AH, 4CH    ; Exit function\n    INT 21H\nEND MAIN`,
  'sub_2nums_8086': `; Subtract two 8-bit numbers\n; 8086 Assembly Program\n.MODEL SMALL\n.CODE\nORG 100H\n\nMAIN:\n    MOV AL, 08H    ; Minuend\n    MOV BL, 03H    ; Subtrahend\n    SUB AL, BL     ; AL = AL - BL\n    MOV AH, 4CH\n    INT 21H\nEND MAIN`,
  'mul_2nums_8086': `; Multiply two 8-bit numbers\n.MODEL SMALL\n.CODE\nORG 100H\nMAIN:\n    MOV AL, 05H\n    MOV BL, 04H\n    MUL BL\n    MOV AH, 4CH\n    INT 21H\nEND MAIN`,
  'div_2nums_8086': `; Divide two 8-bit numbers\n.MODEL SMALL\n.CODE\nORG 100H\nMAIN:\n    MOV AX, 0008H\n    MOV BL, 02H\n    DIV BL\n    MOV AH, 4CH\n    INT 21H\nEND MAIN`,
  'add_2nums_8051': `; Add two 8-bit numbers - 8051\nORG 0000H\nMAIN:\n    MOV A, #05H\n    MOV B, #03H\n    ADD A, B\n    JMP $\nEND`,
  'sub_2nums_8051': `; Subtract - 8051\nORG 0000H\nMAIN:\n    MOV A, #08H\n    MOV B, #03H\n    SUBB A, B\n    JMP $\nEND`,
  'mul_2nums_8051': `; Multiply - 8051\nORG 0000H\nMAIN:\n    MOV A, #05H\n    MOV B, #04H\n    MUL AB\n    JMP $\nEND`,
  'div_2nums_8051': `; Divide - 8051\nORG 0000H\nMAIN:\n    MOV A, #08H\n    MOV B, #02H\n    DIV AB\n    JMP $\nEND`,
  'find_min_array_8086': `; Find minimum - 8086\n.MODEL SMALL\n.DATA\nARRAY DB 15, 08, 23, 04, 16, 42\nSIZE EQU 6\n.CODE\nORG 100H\n    MOV SI, OFFSET ARRAY\n    MOV AL, [SI]\n    MOV CX, SIZE - 1\n    INC SI\nLOOP_MIN:\n    CMP AL, [SI]\n    JLE SKIP\n    MOV AL, [SI]\nSKIP:\n    INC SI\n    LOOP LOOP_MIN\nEND`,
  'find_max_array_8086': `; Find maximum - 8086\n.MODEL SMALL\n.DATA\nARRAY DB 15, 08, 23, 04, 16, 42\nSIZE EQU 6\n.CODE\nORG 100H\n    MOV SI, OFFSET ARRAY\n    MOV AL, [SI]\n    MOV CX, SIZE - 1\n    INC SI\nLOOP_MAX:\n    CMP AL, [SI]\n    JGE SKIP\n    MOV AL, [SI]\nSKIP:\n    INC SI\n    LOOP LOOP_MAX\nEND`,
  'find_min_array_8051': `; Find minimum - 8051\nORG 0000H\nORG 30H\nARRAY: DB 15H, 08H, 23H, 04H, 16H\nMAIN:\n    MOV R0, #30H\n    MOV A, @R0\n    MOV R1, #04H\n    INC R0\nLOOP: MOV B, @R0\n    CJNE A, B, NEXT\n    JMP SKIP\nNEXT: JC SKIP\n    MOV A, B\nSKIP: INC R0\n    DJNZ R1, LOOP\n    JMP $\nEND`,
  'find_max_array_8051': `; Find maximum - 8051\nORG 0000H\nORG 30H\nARRAY: DB 15H, 08H, 23H, 04H, 16H\nMAIN:\n    MOV R0, #30H\n    MOV A, @R0\n    MOV R1, #04H\n    INC R0\nLOOP: MOV B, @R0\n    CJNE A, B, NEXT\n    JMP SKIP\nNEXT: JNC SKIP\n    MOV A, B\nSKIP: INC R0\n    DJNZ R1, LOOP\n    JMP $\nEND`,
  'sort_asc_array_8086': `; Bubble sort ascending - 8086\n.MODEL SMALL\n.DATA\nARRAY DB 64, 34, 25, 12, 22, 11, 90\nSIZE EQU 7\n.CODE\nORG 100H\n    MOV CX, SIZE - 1\nOUTER_LOOP:\n    MOV SI, OFFSET ARRAY\n    MOV DX, SIZE - 1\nINNER_LOOP:\n    MOV AL, [SI]\n    CMP AL, [SI + 1]\n    JLE NO_SWAP\n    XCHG AL, [SI + 1]\n    MOV [SI], AL\nNO_SWAP:\n    INC SI\n    DEC DX\n    JNZ INNER_LOOP\n    LOOP OUTER_LOOP\nEND`,
  'sort_desc_array_8086': `; Bubble sort descending - 8086\n.MODEL SMALL\n.DATA\nARRAY DB 64, 34, 25, 12, 22, 11, 90\nSIZE EQU 7\n.CODE\nORG 100H\n    MOV CX, SIZE - 1\nOUTER_LOOP:\n    MOV SI, OFFSET ARRAY\n    MOV DX, SIZE - 1\nINNER_LOOP:\n    MOV AL, [SI]\n    CMP AL, [SI + 1]\n    JGE NO_SWAP\n    XCHG AL, [SI + 1]\n    MOV [SI], AL\nNO_SWAP:\n    INC SI\n    DEC DX\n    JNZ INNER_LOOP\n    LOOP OUTER_LOOP\nEND`,
  'sort_asc_array_8051': `; Bubble sort asc - 8051\nORG 0000H\nORG 30H\nARRAY: DB 64, 34, 25, 12, 22, 11, 90\nMAIN:\n    MOV R2, #6\nOUTER:\n    MOV R0, #30H\n    MOV R1, #6\nINNER:\n    MOV A, @R0\n    MOV 00H, @R0\n    INC R0\n    MOV B, @R0\n    CJNE A, B, CHKSWAP\n    JMP NSWAP\nCHKSWAP:\n    JC NSWAP\n    MOV @R0, 00H\n    DEC R0\n    MOV @R0, B\n    INC R0\nNSWAP:\n    DJNZ R1, INNER\n    DJNZ R2, OUTER\n    JMP $\nEND`,
  'sort_desc_array_8051': `; Bubble sort desc - 8051\nORG 0000H\nORG 30H\nARRAY: DB 64, 34, 25, 12, 22, 11, 90\nMAIN:\n    MOV R2, #6\nOUTER:\n    MOV R0, #30H\n    MOV R1, #6\nINNER:\n    MOV A, @R0\n    MOV 00H, @R0\n    INC R0\n    MOV B, @R0\n    CJNE A, B, CHKSWAP\n    JMP NSWAP\nCHKSWAP:\n    JNC NSWAP\n    MOV @R0, 00H\n    DEC R0\n    MOV @R0, B\n    INC R0\nNSWAP:\n    DJNZ R1, INNER\n    DJNZ R2, OUTER\n    JMP $\nEND`,
  'gcd_2nums_8086': `; GCD using Euclidean algorithm - 8086\n.MODEL SMALL\n.DATA\nNUM1 DW 48\nNUM2 DW 18\n.CODE\nORG 100H\n    MOV AX, NUM1\n    MOV BX, NUM2\nLOOP_GCD:\n    CMP BX, 0\n    JE END_GCD\n    MOV DX, 0\n    DIV BX\n    MOV AX, BX\n    MOV BX, DX\n    JMP LOOP_GCD\nEND_GCD:\nEND`,
  'lcm_2nums_8086': `; LCM of two numbers - 8086\n.MODEL SMALL\n.DATA\nNUM1 DW 12\nNUM2 DW 18\n.CODE\nORG 100H\n    MOV AX, NUM1\n    MOV BX, NUM2\n    MOV CX, AX\n    MUL BX\n    MOV BX, CX\nGCD_LOOP:\n    CMP BX, 0\n    JE CALC_LCM\n    MOV DX, 0\n    DIV BX\n    MOV AX, BX\n    MOV BX, DX\n    JMP GCD_LOOP\nCALC_LCM:\nEND`,
  'block_transfer_string_instr_8086': `; Block transfer using REP MOVSB - 8086\n.MODEL SMALL\n.DATA\nSOURCE DB 'HELLO WORLD', 0\nDEST DB 20 DUP(0)\n.CODE\nORG 100H\n    LEA SI, SOURCE\n    LEA DI, DEST\n    MOV CX, 11\n    REP MOVSB\nEND`,
  'block_transfer_no_string_instr_8086': `; Block transfer without string instr - 8086\n.MODEL SMALL\n.DATA\nSOURCE DB 'HELLO WORLD', 0\nDEST DB 20 DUP(0)\n.CODE\nORG 100H\n    LEA SI, SOURCE\n    LEA DI, DEST\n    MOV CX, 11\nLOOP_TRANSFER:\n    MOV AL, [SI]\n    MOV [DI], AL\n    INC SI\n    INC DI\n    LOOP LOOP_TRANSFER\nEND`,
  'block_transfer_8051': `; Block transfer - 8051\nORG 0000H\nORG 30H\nSOURCE: DB 'HELLO'\nMAIN:\n    MOV R0, #30H\n    MOV R1, #40H\n    MOV R2, #05H\nLOOP:\n    MOV A, @R0\n    MOV @R1, A\n    INC R0\n    INC R1\n    DJNZ R2, LOOP\n    JMP $\nEND`,
  'uart_tx_string_8051': `; UART transmit string - 8051\nORG 0000H\nMAIN:\n    MOV SCON, #50H\n    MOV TMOD, #20H\n    MOV TH1, #-3\n    SETB TR1\n    ACALL TX_STRING\n    JMP $\nTX_STRING:\n    MOV DPTR, #TEXT\nTX_LOOP:\n    CLR A\n    MOVC A, @A+DPTR\n    JZ TX_END\n    MOV SBUF, A\n    INC DPTR\nTX_WAIT:\n    JNB TI, TX_WAIT\n    CLR TI\n    JMP TX_LOOP\nTX_END:\n    RET\nTEXT: DB 'UART TEST', 0\nEND`,
  'led_blink_timer_8051': `; LED blink with timer - 8051\nORG 0000H\nMAIN:\n    MOV TMOD, #01H\n    MOV TH0, #3CH\n    MOV TL0, #0B0H\n    SETB ET0\n    SETB EA\n    SETB TR0\nLOOP:\n    JMP LOOP\nORG 03H\n    CLR TR0\n    MOV TH0, #3CH\n    MOV TL0, #0B0H\n    CPL P1.0\n    SETB TR0\n    RETI\nEND`,
  'bcd_add_8bit_8086': `; BCD addition - 8086\n.MODEL SMALL\n.CODE\nORG 100H\n    MOV AL, 09H\n    MOV BL, 08H\n    ADD AL, BL\n    DAA\nEND`,
  'hex_to_ascii_8086': `; Hex to ASCII - 8086\n.MODEL SMALL\n.CODE\nORG 100H\n    MOV AL, 0FH\n    CMP AL, 09H\n    JLE ADD_30\n    ADD AL, 07H\nADD_30:\n    ADD AL, 30H\nEND`,
  'mem_data_exchange_8086': `; Memory data exchange - 8086\n.MODEL SMALL\n.DATA\nDATA1 DB 0AAH\nDATA2 DB 0BBH\n.CODE\nORG 100H\n    MOV AL, DATA1\n    MOV BL, DATA2\n    MOV DATA1, BL\n    MOV DATA2, AL\nEND`,
  'sum_10nums_8051': `; Sum of 10 numbers - 8051\nORG 0000H\nORG 30H\nARRAY: DB 1, 2, 3, 4, 5, 6, 7, 8, 9, 10\nMAIN:\n    MOV R0, #30H\n    MOV A, #00H\n    MOV R1, #0AH\nLOOP:\n    ADD A, @R0\n    INC R0\n    DJNZ R1, LOOP\n    MOV R2, A\n    JMP $\nEND`,
  'search_byte_array_8051': `; Linear search - 8051\nORG 0000H\nORG 30H\nARRAY: DB 15, 08, 23, 04, 16, 2AH, 1FH, 05H, 3EH, 12H\nMAIN:\n    MOV A, #04H\n    MOV R0, #30H\n    MOV R1, #0AH\nLOOP:\n    CJNE A, @R0, NEXT\n    MOV R2, R0\n    JMP FOUND\nNEXT:\n    INC R0\n    DJNZ R1, LOOP\n    MOV R2, #FFH\nFOUND:\n    JMP $\nEND`,
  'factorial_num_8051': `; Factorial - 8051\nORG 0000H\nMAIN:\n    MOV A, #05H\n    ACALL FACTORIAL\n    MOV R3, A\n    JMP $\nFACTORIAL:\n    MOV B, #01H\n    CJNE A, #00H, FACLOOP\n    RET\nFACLOOP:\n    MUL AB\n    RET\nEND`,
  'square_wave_p1_2_8051': `; Square wave on P1.2 - 8051\nORG 0000H\nMAIN:\n    MOV P1, #00H\nLOOP:\n    CPL P1.2\n    MOV R7, #50\n    ACALL DELAY\n    JMP LOOP\nDELAY:\n    MOV R6, #100\nDL:\n    DJNZ R6, DL\n    DJNZ R7, DELAY\n    RET\nEND`,
};

const ASM_FILES = Object.keys(ASM_FILES_DB);

export default function Terminal({ children, onUpload, onFind, onBossKey }) {
  const [history, setHistory] = useState([
    { type: 'command', text: 'Z:\\>SET BLASTER=A220 I7 D1 H5 T6' },
    { type: 'blank', text: '' },
    { type: 'command', text: 'Z:\\>mount c c://tasm' },
    { type: 'output', text: 'Drive C is mounted as local directory c://tasm' },
    { type: 'blank', text: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [showFileList, setShowFileList] = useState(false);
  const [copiedFile, setCopiedFile] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Handle file copy
  const handleCopyFile = (filename) => {
    const content = ASM_FILES_DB[filename] || '';
    navigator.clipboard.writeText(content).then(() => {
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    });
  };

  // Handle terminal input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = currentInput.trim();
      const command = input.toLowerCase();
      
      // Add command to history
      const newHistory = [
        ...history,
        { type: 'command', text: `Z:\\>${currentInput}` },
      ];

      // Process commands
      if (command === 'ls' || command === 'dir') {
        newHistory.push({ type: 'blank', text: '' });
        setShowFileList(true);
      } else if (command.startsWith('cat ')) {
        const filename = command.slice(4).trim();
        if (ASM_FILES_DB[filename]) {
          newHistory.push({ type: 'blank', text: '' });
          newHistory.push({ type: 'output', text: `--- ${filename}.asm ---` });
          newHistory.push({ type: 'code', text: ASM_FILES_DB[filename] });
          newHistory.push({ type: 'blank', text: '' });
          setShowFileList(false);
        } else {
          newHistory.push({ type: 'output', text: `cat: ${filename}: No such file or directory` });
        }
      } else if (command.startsWith('cp ')) {
        const filename = command.slice(3).trim();
        if (ASM_FILES_DB[filename]) {
          handleCopyFile(filename);
          newHistory.push({ type: 'output', text: `✓ ${filename} copied to clipboard` });
        } else {
          newHistory.push({ type: 'output', text: `cp: ${filename}: No such file or directory` });
        }
      } else if (command === 'help' || command === '?') {
        newHistory.push({ type: 'blank', text: '' });
        newHistory.push({ type: 'output', text: 'Available commands:' });
        newHistory.push({ type: 'output', text: '  ls, dir        - List all assembly files' });
        newHistory.push({ type: 'output', text: '  cat <file>     - Display file contents' });
        newHistory.push({ type: 'output', text: '  cp <file>      - Copy file to clipboard' });
        newHistory.push({ type: 'output', text: '  help, ?        - Show this help message' });
        newHistory.push({ type: 'blank', text: '' });
      } else if (command !== '') {
        newHistory.push({ type: 'output', text: `'${input}' is not recognized as an internal or external command.` });
      }

      newHistory.push({ type: 'blank', text: '' });
      setHistory(newHistory);
      setCurrentInput('');
      
      // Scroll to bottom
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="dosbox-window" id="dosbox-window">
      <TitleBar />
      <div className="terminal-body" id="terminal-body">
        <div className="boot-box-container">
          <div className="boot-box">
            {children}
          </div>
        </div>
        <div className="terminal-content" ref={terminalRef}>
          {history.map((line, i) => (
            <div key={i} className={`terminal-line ${line.type}`}>
              {line.type === 'code' ? (
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'inherit' }}>{line.text}</pre>
              ) : (
                line.text
              )}
            </div>
          ))}

          {/* File list display */}
          {showFileList && (
            <div className="file-listing">
              {ASM_FILES.map((file) => (
                <div key={file} className="file-row">
                  <span className="file-name">{file}</span>
                  {copiedFile === file && (
                    <span className="copy-status">✓ COPIED</span>
                  )}
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopyFile(file)}
                    title="Copy file content"
                  >
                    [COPY]
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input line */}
          <div className="terminal-line input-line">
            <span>Z:\&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              autoFocus
            />
            <span className="cursor" />
          </div>
        </div>
      </div>
      <HotkeyBar
        onUpload={onUpload}
        onFind={onFind}
        onBossKey={onBossKey}
      />
    </div>
  );
}
