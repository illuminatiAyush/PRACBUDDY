import { useState, useRef, useEffect } from 'react';
import TitleBar from './TitleBar';
import HotkeyBar from './HotkeyBar';

// Assembly files with actual code content
const ASM_FILES_DB = {
  "add_2nums_8086": ".model small\n.data\n    a db 04h\n    b db 03h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    add al, bl\n    int 03h\nend",
  "sub_2nums_8086": ".model small\n.data\n    a db 04h\n    b db 03h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    sub al, bl\n    int 03h\nend",
  "div_2nums_8086": ".model small\n.data\n    a dw 000fh\n    b db 04h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov ax, a\n    mov bl, b\n    div bl\n    int 03h\nend",
  "mul_2nums_8086": ".model small\n.data\n    a db 01h\n    b db 08h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    mul bl\n    int 03h\nend",
  "add_2nums_8051": "ORG 0000H\na EQU 04H\nb EQU 03H\nMOV A,#a\nMOV R0,#b\nADD A,R0\nHERE: SJMP HERE\nEND",
  "sub_2nums_8051": "ORG 0000H\na EQU 04H\nb EQU 03H\nMOV A,#a\nMOV R0,#b\nCLR C\nSUBB A,R0\nHERE: SJMP HERE\nEND",
  "div_2nums_8051": "ORG 0000H\na EQU 0FH\nb EQU 04H\nMOV A,#a\nMOV B,#b\nDIV AB\nHERE: SJMP HERE\nEND",
  "mul_2nums_8051": "ORG 0000H\na EQU 01H\nb EQU 08H\nMOV A,#a\nMOV B,#b\nMUL AB\nHERE: SJMP HERE\nEND",
  "find_min_array_8086": ".model small\n.data\n    list db 04h, 05h, 06h, 07h, 08h\n    min  db 00h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov cx, 05h\n    mov si, offset list\n    mov al, [si]\n    dec cx\n\nentry:  inc si\n        cmp al, [si]\n        jc  inLis\n        mov al, [si]\ninLis:  loop entry\n\n        mov min, al\n        int 03h\nends\nend",
  "find_max_array_8086": ".model small\n.data\n    list db 04h, 05h, 06h, 07h, 08h\n    max  db 00h\n.code\n    mov ax, @data\n    mov ds, ax\n    mov cx, 05h\n    mov si, offset list\n    mov al, [si]\n    dec cx\n\nentry:  inc si\n        cmp al, [si]\n        jnc inLis\n        mov al, [si]\ninLis:  loop entry\n\n        mov max, al\n        int 03h\nends\nend",
  "find_min_array_8051": "ORG 0000H\nlist: DB 04H,05H,06H,07H,08H\nmin: DB 00H\nMOV R2,#05H\nMOV R0,#list\nMOV A,@R0\nDEC R2\nentry: INC R0\nMOV R1,@R0\nCLR C\nSUBB A,R1\nJC inLis\nMOV A,R1\ninLis: DJNZ R2,entry\nMOV min,A\nHERE: SJMP HERE\nEND",
  "find_max_array_8051": "ORG 0000H\nlist: DB 04H,05H,06H,07H,08H\nmax: DB 00H\nMOV R2,#05H\nMOV R0,#list\nMOV A,@R0\nDEC R2\nentry: INC R0\nMOV R1,@R0\nCLR C\nSUBB A,R1\nJNC inLis\nMOV A,R1\ninLis: DJNZ R2,entry\nMOV max,A\nHERE: SJMP HERE\nEND",
  "sort_asc_array_8086": ".model small\n.data\n    array db 13h, 14h, 07h, 22h, 21h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov bx, 05h\n\nKaran:  mov si, offset array\n        mov cx, 04h\n\nup:     mov al, [si]\n        cmp al, [si+1]\n        jnc dn\n        xchg al, [si+1]\n        xchg al, [si]\ndn:     inc si\n        loop up\n\n        dec bx\n        jnz Karan\n\n        int 03h\nend",
  "sort_desc_array_8086": ".model small\n.data\n    array db 13h, 14h, 07h, 22h, 21h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov bx, 05h\n\nKaran:  mov si, offset array\n        mov cx, 04h\n\nup:     mov al, [si]\n        cmp al, [si+1]\n        jc  dn\n        xchg al, [si+1]\n        xchg al, [si]\ndn:     inc si\n        loop up\n\n        dec bx\n        jnz Karan\n\n        int 03h\nend",
  "sort_asc_array_8051": "ORG 0000H\narray: DB 13H,14H,07H,22H,21H\nstart: MOV R3,#05H\nKaran: MOV R0,#array\nMOV R2,#04H\nup: MOV A,@R0\nMOV R1,A\nINC R0\nMOV A,@R0\nCLR C\nSUBB A,R1\nJNC dn\nMOV A,@R0\nXCH A,R1\nMOV @R0,A\nDEC R0\nMOV A,R1\nMOV @R0,A\nINC R0\ndn: DJNZ R2,up\nDJNZ R3,Karan\nHERE: SJMP HERE\nEND",
  "sort_desc_array_8051": "ORG 0000H\narray: DB 13H,14H,07H,22H,21H\nstart: MOV R3,#05H\nKaran: MOV R0,#array\nMOV R2,#04H\nup: MOV A,@R0\nMOV R1,A\nINC R0\nMOV A,@R0\nCLR C\nSUBB A,R1\nJC dn\nMOV A,@R0\nXCH A,R1\nMOV @R0,A\nDEC R0\nMOV A,R1\nMOV @R0,A\nINC R0\ndn: DJNZ R2,up\nDJNZ R3,Karan\nHERE: SJMP HERE\nEND",
  "block_transfer_string_instr_8086": ".model small\n.data\n    string1 db 22h, 10h, 13h, 50h, 73h\n    string2 db 5 dup(0)\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov es, ax\n    lea si, string1\n    lea di, string2\n    mov cx, 05h\n    cld\n    rep movsb\n    int 03h\nends\nend",
  "block_transfer_no_string_instr_8086": ".model small\n.data\n    array1 db 20h, 13h, 30h, 25h, 34h\n    array2 db 00h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov cx, 05h\n    mov si, offset array1\n    mov di, offset array2\n\nKaran:  mov al, [si]\n        mov [di], al\n        inc si\n        inc di\n        dec cx\n        jnz Karan\n\n        int 03h\nend",
  "block_transfer_8051": "ORG 0000H\nstring1: DB 22H,10H,13H,50H,73H\nstring2: DB 00H,00H,00H,00H,00H\nstart: MOV R0,#string1\nMOV R1,#string2\nMOV R2,#05H\ncopy: MOV A,@R0\nMOV @R1,A\nINC R0\nINC R1\nDJNZ R2,copy\nHERE: SJMP HERE\nEND",
  "gcd_2nums_8086": ".model small\n.data\n    a dw 0048h\n    b dw 0018h\n    res dw 00h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov ax, a\n    mov bx, b\n\ngcd:    cmp ax, bx\n        je  done\n        jl  less\n        sub ax, bx\n        jmp gcd\nless:   sub bx, ax\n        jmp gcd\n\ndone:   mov res, ax\n        int 03h\nends\nend",
  "lcm_2nums_8086": ".model small\n.data\n    a   dw 000ch\n    b   dw 0008h\n    res dw 00h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov ax, a\n    mov bx, b\n    mov cx, ax\n    mov si, bx\n\ngcd:    cmp ax, bx\n        je  done\n        jl  less\n        sub ax, bx\n        jmp gcd\nless:   sub bx, ax\n        jmp gcd\n\ndone:   mov bx, ax\n        mov ax, cx\n        xor dx, dx\n        mul si\n        div bx\n        mov res, ax\n        int 03h\nends\nend",
  "uart_tx_string_8051": " ORG 0000H\nMOV SCON,#20H\nMOV TMOD,#20H\nMOV TH1,#0FDH\nSETB TR1\nMOV DPTR,#MYDATA\nBACK: CLR A\nMOVC A,@A+DPTR\nJZ EXIT\nMOV SBUF,A\nHERE: JNB TI,HERE\nCLR TI\nINC DPTR\nSJMP BACK\nEXIT: SJMP EXIT\nMYDATA: DB \"KARAN JADHAV\",0\nEND",
  "led_blink_timer_8051": "ORG 0000H\nLJMP KARAN\nKARAN: MOV P1,#00H\nACALL DELAY\nMOV P1,#0FFH\nACALL DELAY\nSJMP KARAN\nDELAY: MOV R2,#0FFH\nD1: MOV R3,#0FFH\nD2: DJNZ R3,D2\nDJNZ R2,D1\nRET\nEND",
  "bcd_add_8bit_8086": ".model small\n.data\n    a db 35h\n    b db 48h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov al, a\n    mov bl, b\n    add al, bl\n    daa\n    int 03h\nends\nend",
  "hex_to_ascii_8086": ".model small\n.data\n    hexnum db 0fh\n    ascii  db 00h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov al, hexnum\n    and al, 0fh\n    cmp al, 09h\n    jle num\n    add al, 37h\n    jmp done\nnum:    add al, 30h\ndone:   mov ascii, al\n        int 03h\nends\nend",
  "mem_data_exchange_8086": ".model small\n.data\n    mem1 dw 1234h\n    mem2 dw 5678h\n.code\nstart:\n    mov ax, @data\n    mov ds, ax\n    mov ax, mem1\n    mov bx, mem2\n    mov mem1, bx\n    mov mem2, ax\n    int 03h\nends\nend",
  "sum_10nums_8051": "ORG 0000H\narray: DB 01H,02H,03H,04H,05H,06H,07H,08H,09H,0AH\nMOV R0,#array\nMOV R2,#0AH\nMOV A,#00H\nLOOP: ADD A,@R0\nINC R0\nDJNZ R2,LOOP\nHERE: SJMP HERE\nEND",
  "search_byte_array_8051": "ORG 0000H\narray: DB 10H,20H,25H,30H,40H\nMOV R0,#array\nMOV R2,#05H\nMOV A,#25H\nLOOP: CJNE A,@R0,NEXT\nMOV R1,R0\nSJMP HERE\nNEXT: INC R0\nDJNZ R2,LOOP\nMOV R1,#0FFH\nHERE: SJMP HERE\nEND",
  "factorial_num_8051": "ORG 0000H\nMOV A,#01\nMOV R0,#01\nayush: MOV B,R0\nMUL AB\nINC R0\nCJNE R0,#08H,ayush\nHERE: SJMP HERE\nEND",
  "square_wave_p1_2_8051": "ORG 0000H\nMOV TMOD,#01H\nSTART: MOV TL0,#20H\nMOV TH0,#90H\nSETB TR0\nPOLL: JNB TF0,POLL\nCLR TR0\nCPL P1.2\nCLR TF0\nSJMP START\nEND",
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
