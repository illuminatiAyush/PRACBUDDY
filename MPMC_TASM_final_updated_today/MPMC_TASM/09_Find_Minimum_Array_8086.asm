.model small
.data
    list db 04h, 05h, 06h, 07h, 08h
    min  db 00h
.code
    mov ax, @data
    mov ds, ax
    mov cx, 05h
    mov si, offset list
    mov al, [si]
    dec cx

entry:  inc si
        cmp al, [si]
        jc  inLis
        mov al, [si]
inLis:  loop entry

        mov min, al
        int 03h
ends
end
