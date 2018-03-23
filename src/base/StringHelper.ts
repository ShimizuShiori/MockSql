export class StringHelper {
    /**
     * 重复一个字符串
     * @param str 目标字符串
     * @param count 重复的次数
     */
    public static Repeat(str: string, count: number): string {
        let result: string[] = [];
        for (let i = 0; i < count; i++) result.push(str);
        return result.join("");
    }

    public static SplitByIndexes(str: string, indexes: number[]): string[] {
        let result: string[] = [];
        let currentIndex = 0;
        let currentIndexIndex = 0;
        let currentArray = [];
        var length: number = str.length;
        while (currentIndex < length) {
            if (currentIndex === 0) {
                currentArray.push(str[currentIndex]);
            } else if (currentIndex === indexes[currentIndexIndex]) {
                result.push(currentArray.join(""));
                currentArray = [str[currentIndex]];
                currentIndexIndex++;
            } else {
                currentArray.push(str[currentIndex]);
            }
            currentIndex++;
        }
        if (currentArray.length !== 0) result.push(currentArray.join(""));
        return result;
    }

    public static Insert(
        str: string,
        index: number,
        paddingStr: string
    ): string {
        let array = StringHelper.SplitByIndexes(str, [index]);
        return array.join(paddingStr);
    }

    public static ReplaceRange(
        str: string,
        startIndex: number,
        count: number,
        paddingString: string
    ): string {
        let endIndex = startIndex + count;
        let array = StringHelper.SplitByIndexes(str, [startIndex, endIndex]);
        array[1] = paddingString;
        return array.join("");
    }

    public static PaddingLeft(
        str: string,
        paddingStr: string,
        length: number
    ): string {
        let result = str;
        while (result.length < length) {
            result = paddingStr + result;
        }
        return result;
    }
}
