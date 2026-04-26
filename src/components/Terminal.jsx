import { useState, useRef, useEffect } from 'react';
import TitleBar from './TitleBar';
import HotkeyBar from './HotkeyBar';

// Assembly files with actual code content
const ASM_FILES_DB = {
  "add_2nums_8086": ".model small\n.data\n    a db 04h\n    b db 03h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    add al, bl\n    int 03h\nend",
  "sub_2nums_8086": ".model small\n.data\n    a db 04h\n    b db 03h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    sub al, bl\n    int 03h\nend",
  "div_2nums_8086": ".model small\n.data\n    a dw 000fh\n    b db 04h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov ax, a\n    mov bl, b\n    div bl\n    int 03h\nend",
  "mul_2nums_8086": ".model small\n.data\n    a db 01h\n    b db 08h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    mul bl\n    int 03h\nend",
  "add_2nums_8051": "        ORG  0000H\n\n        MOV  A, #02H\n        ADD  A, #03H\n        MOV  R0, A\n\n        CLR  A\n        MOV  A, #04H\n        SUBB A, #03H\n        MOV  R1, A\n\n        CLR  A\n        MOV  A, #02H\n        MOV  B, #03H\n        MUL  AB\n        MOV  R2, A\n\n        CLR  A\n        MOV  A, #06H\n        MOV  B, #03H\n        DIV  AB\n        MOV  R3, A\n        MOV  R4, B\n\n        END",
  "sub_2nums_8051": "ORG 0000H\n    MOV R0, #50H\n    MOV R1, #20H\n    MOV A, R0\n    CLR C\n    SUBB A, R1\n    MOV R2, A\n    SJMP $\nEND",
  "div_2nums_8051": "ORG 0000H\n    MOV A, #64H\n    MOV B, #0AH\n    DIV AB\n    MOV R0, A\n    MOV R1, B\n    SJMP $\nEND",
  "mul_2nums_8051": "ORG 0000H\n    MOV A, #0AH\n    MOV B, #05H\n    MUL AB\n    MOV R0, A\n    MOV R1, B\n    SJMP $\nEND",
  "find_min_array_8086": ".model small\n.data\n    list db 04h, 05h, 06h, 07h, 08h\n    min  db 00h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov cx, 05h\n    mov si, offset list\n    mov al, [si]\n    dec cx\n\nentry:  inc si\n        cmp al, [si]\n        jc  inLis\n        mov al, [si]\ninLis:  loop entry\n\n        mov min, al\n        int 03h\nends\nend",
  "find_max_array_8086": ".model small\n.data\n    list db 04h, 05h, 06h, 07h, 08h\n    max  db 00h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov cx, 05h\n    mov si, offset list\n    mov al, [si]\n    dec cx\n\nentry:  inc si\n        cmp al, [si]\n        jnc inLis\n        mov al, [si]\ninLis:  loop entry\n\n        mov max, al\n        int 03h\nends\nend",
  "find_min_array_8051": "ORG 0000H\n    MOV R0, #30H\n    MOV R2, #05H\n    MOV A, @R0\n    MOV 50H, A\n    DEC R2\nLP1:\n    INC R0\n    MOV A, @R0\n    CJNE A, 50H, CHK\nCHK:\n    JNC SKIP1\n    MOV 50H, A\nSKIP1:\n    DJNZ R2, LP1\n    MOV 40H, 50H\n    SJMP $\n\nORG 30H\nDB 05H, 02H, 08H, 01H, 09H\nEND",
  "find_max_array_8051": "        ORG  0000H\n\n        MOV  R0, #20H\n        MOV  R1, #05H\n        MOV  A,  #00H\n\nUP:     MOV  B,  @R0\n        CJNE A,  B, KARAN\nKARAN:  JNC  A_BIG\n        MOV  A,  B\n\nA_BIG:  INC  R0\n        DJNZ R1, UP\n\n        MOV  45H, A\n\n        END",
  "sort_asc_array_8086": ".model small\n.data\n    array db 13h, 14h, 07h, 22h, 21h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov bx, 05h\n\nKaran:  mov si, offset array\n        mov cx, 04h\n\nup:     mov al, [si]\n        cmp al, [si+1]\n        jnc dn\n        xchg al, [si+1]\n        xchg al, [si]\ndn:     inc si\n        loop up\n\n        dec bx\n        jnz Karan\n\n        int 03h\nend",
  "sort_desc_array_8086": ".model small\n.data\n    array db 13h, 14h, 07h, 22h, 21h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov bx, 05h\n\nKaran:  mov si, offset array\n        mov cx, 04h\n\nup:     mov al, [si]\n        cmp al, [si+1]\n        jc  dn\n        xchg al, [si+1]\n        xchg al, [si]\ndn:     inc si\n        loop up\n\n        dec bx\n        jnz Karan\n\n        int 03h\nend",
  "sort_asc_array_8051": "ORG 0000H\n    MOV R5, #04H\nOUTER:\n    MOV R6, #04H\n    MOV R0, #30H\nINNER:\n    MOV A, R0\n    ADD A, #01H\n    MOV R1, A\n    MOV A, @R0\n    MOV 50H, A\n    MOV A, @R1\n    CJNE A, 50H, CHK\nCHK:\n    JNC NOSWAP\n    MOV @R1, 50H\n    MOV @R0, A\nNOSWAP:\n    INC R0\n    DJNZ R6, INNER\n    DJNZ R5, OUTER\n    SJMP $\n\nORG 30H\nDB 05H, 03H, 08H, 01H, 07H\nEND",
  "sort_desc_array_8051": "ORG 0000H\n    MOV R5, #04H\nOUTER:\n    MOV R6, #04H\n    MOV R0, #30H\nINNER:\n    MOV A, R0\n    ADD A, #01H\n    MOV R1, A\n    MOV A, @R0\n    MOV 50H, A\n    MOV A, @R1\n    CJNE A, 50H, CHK\nCHK:\n    JC NOSWAP\n    MOV @R1, 50H\n    MOV @R0, A\nNOSWAP:\n    INC R0\n    DJNZ R6, INNER\n    DJNZ R5, OUTER\n    SJMP $\n\nORG 30H\nDB 05H, 03H, 08H, 01H, 07H\nEND",
  "block_transfer_string_instr_8086": ".model small\n.data\n    string1 db 22h, 10h, 13h, 50h, 73h\n    string2 db 4 dup(0)\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov es, ax\n    lea si, string1\n    lea di, string2\n    mov cx, 05h\n    cld\n    rep movsb\n    int 03h\nends\nend",
  "block_transfer_no_string_instr_8086": ".model small\n.data\n    array1 db 20h, 13h, 30h, 25h, 34h\n    array2 db 00h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov cx, 05h\n    mov si, offset array1\n    mov di, offset array2\n\nKaran:  mov al, [si]\n        mov [di], al\n        inc si\n        inc di\n        dec cx\n        jnz Karan\n\n        int 03h\nend",
  "block_transfer_8051": "        ORG  0000H\n\n        MOV  R0, #20H\n        MOV  R1, #27H\n        MOV  R7, #05H\n\nKARAN:  MOV  A,  @R0\n        MOV  @R1, A\n        INC  R0\n        INC  R1\n        DJNZ R7, KARAN\n\n        END",
  "gcd_2nums_8086": ".MODEL SMALL\n.STACK 100H\n\n.DATA\n    NUM1   DW 0048H\n    NUM2   DW 0018H\n    RESULT DW ?\n\n.CODE\nMAIN PROC\n    MOV AX, @DATA\n    MOV DS, AX\n    MOV AX, NUM1\n    MOV BX, NUM2\nGCD:\n    CMP AX, BX\n    JE DONE\n    JL LESS\n    SUB AX, BX\n    JMP GCD\nLESS:\n    SUB BX, AX\n    JMP GCD\nDONE:\n    MOV RESULT, AX\n    MOV AH, 4CH\n    INT 21H\nMAIN ENDP\nEND MAIN",
  "lcm_2nums_8086": ".MODEL SMALL\n.STACK 100H\n\n.DATA\n    NUM1   DW 000CH\n    NUM2   DW 0008H\n    RESULT DW ?\n\n.CODE\nMAIN PROC\n    MOV AX, @DATA\n    MOV DS, AX\n    MOV AX, NUM1\n    MOV BX, NUM2\n    MOV CX, AX\n    MOV SI, BX\nGCD:\n    CMP AX, BX\n    JE DONE\n    JL LESS\n    SUB AX, BX\n    JMP GCD\nLESS:\n    SUB BX, AX\n    JMP GCD\nDONE:\n    MOV BX, AX\n    MOV AX, CX\n    XOR DX, DX\n    MUL SI\n    DIV BX\n    MOV RESULT, AX\n    MOV AH, 4CH\n    INT 21H\nMAIN ENDP\nEND MAIN",
  "uart_tx_string_8051": "        MOV  SCON, #20H\n        MOV  TMOD, #20H\n        MOV  TH1,  #0FDH\n        SETB TR1\n        MOV  DPTR, #MYDATA\n\nBACK:   CLR  A\n        MOVC A, @A+DPTR\n        JZ   EXIT\n        MOV  SBUF, A\nHERE:   JNB  TI, HERE\n        CLR  TI\n        INC  DPTR\n        SJMP BACK\n\nEXIT:   SJMP EXIT\n\nMYDATA: DB   \"KARAN JADHAV\", 0\n\n        END",
  "led_blink_timer_8051": "        ORG  0000H\n        LJMP KARAN\n\nKARAN:  MOV  P1, #00H\n        ACALL DELAY\n        MOV  P1, #0FFH\n        ACALL DELAY\n        SJMP KARAN\n\nDELAY:  MOV  R2, #0FFH\nD1:     MOV  R3, #0FFH\nD2:     DJNZ R3, D2\n        DJNZ R2, D1\n        RET\n\n        END",
  "bcd_add_8bit_8086": ".MODEL SMALL\n.STACK 100H\n\n.DATA\n    NUM1 DB 35H\n    NUM2 DB 48H\n\n.CODE\nMAIN PROC\n    MOV AX, @DATA\n    MOV DS, AX\n    MOV AL, NUM1\n    MOV BL, NUM2\n    ADD AL, BL\n    DAA\n    MOV AH, 4CH\n    INT 21H\nMAIN ENDP\nEND MAIN",
  "hex_to_ascii_8086": ".MODEL SMALL\n.STACK 100H\n\n.DATA\n    HEXNUM DB 0FH\n    ASCII  DB ?\n\n.CODE\nMAIN PROC\n    MOV AX, @DATA\n    MOV DS, AX\n    MOV AL, HEXNUM\n    AND AL, 0FH\n    CMP AL, 09H\n    JLE NUM\n    ADD AL, 37H\n    JMP DONE\nNUM:\n    ADD AL, 30H\nDONE:\n    MOV ASCII, AL\n    MOV AH, 4CH\n    INT 21H\nMAIN ENDP\nEND MAIN",
  "mem_data_exchange_8086": ".MODEL SMALL\n.STACK 100H\n\n.DATA\n    MEM1 DW 1234H\n    MEM2 DW 5678H\n\n.CODE\nMAIN PROC\n    MOV AX, @DATA\n    MOV DS, AX\n    MOV AX, MEM1\n    MOV BX, MEM2\n    MOV MEM1, BX\n    MOV MEM2, AX\n    MOV AH, 4CH\n    INT 21H\nMAIN ENDP\nEND MAIN",
  "sum_10nums_8051": "ORG 0000H\n    MOV R0, #30H\n    MOV R2, #0AH\n    CLR A\n    MOV R3, #00H\nLP1:\n    ADD A, @R0\n    JNC SKIP1\n    INC R3\nSKIP1:\n    INC R0\n    DJNZ R2, LP1\n    MOV 40H, A\n    MOV 41H, R3\n    SJMP $\n\nORG 30H\nDB 01H, 02H, 03H, 04H, 05H, 06H, 07H, 08H, 09H, 0AH\nEND",
  "search_byte_array_8051": "ORG 0000H\n    MOV R0, #30H\n    MOV R2, #05H\n    MOV A, #03H\nSEARCH:\n    CJNE A, @R0, NEXT\n    MOV 40H, #01H\n    SJMP DONE\nNEXT:\n    INC R0\n    DJNZ R2, SEARCH\n    MOV 40H, #00H\nDONE:\n    SJMP $\n\nORG 30H\nDB 01H, 02H, 03H, 04H, 05H\nEND",
  "factorial_num_8051": "ORG 0000H\n    MOV R0, #05H\n    MOV A, #01H\nFACT:\n    MOV B, A\n    MOV A, R0\n    MUL AB\n    DJNZ R0, FACT\n    MOV 30H, A\n    MOV 31H, B\n    SJMP $\nEND",
  "square_wave_p1_2_8051": "ORG 0000H\n    MOV TMOD, #01H\nHERE:\n    CPL P1.2\n    MOV TH0, #0FCH\n    MOV TL0, #18H\n    SETB TR0\nWAIT:\n    JNB TF0, WAIT\n    CLR TR0\n    CLR TF0\n    SJMP HERE\nEND",
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
                <div
                  key={file}
                  className={`file-row ${copiedFile === file ? 'file-row-just-copied' : ''}`}
                  onClick={() => handleCopyFile(file)}
                  title="Click anywhere to copy code"
                >
                  <span className="file-name">{file}</span>
                  <span className="file-row-copy-label">
                    {copiedFile === file ? '✓ COPIED' : '[COPY]'}
                  </span>
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
