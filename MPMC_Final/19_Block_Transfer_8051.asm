ORG 0000H
    MOV R0, #30H
    MOV R1, #40H
    MOV R2, #05H
LP1:
    MOV A, @R0
    MOV @R1, A
    INC R0
    INC R1
    DJNZ R2, LP1
    MOV R0, #40H
    MOV R1, #30H
    MOV R2, #05H
LP2:
    MOV A, @R0
    MOV @R1, A
    INC R0
    INC R1
    DJNZ R2, LP2
    SJMP $

ORG 30H
DB 01H, 02H, 03H, 04H, 05H
END
