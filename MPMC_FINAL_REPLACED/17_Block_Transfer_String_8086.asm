.model small
.data
    string1 db 22h, 10h, 13h, 50h, 73h
    string2 db 4 dup(0)
.code
start:
    mov ax, @data
    mov ds, ax
    mov es, ax
    lea si, string1
    lea di, string2
    mov cx, 05h
    cld
    rep movsb
    int 03h
ends
end
