.model small
.data
    hexnum db 0fh
    ascii  db 00h
.code
start:
    mov ax, @data
    mov ds, ax
    mov al, hexnum
    and al, 0fh
    cmp al, 09h
    jle num
    add al, 37h
    jmp done
num:    add al, 30h
done:   mov ascii, al
        int 03h
ends
end
