import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@codeexpander/dev-tools-ui';
import { copyWithToast } from '../toast';
import { useI18n } from '../context';

const LoremGenerator = () => {
  const { t } = useI18n();
  const [generatedText, setGeneratedText] = useState('');
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
    'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
    'quas', 'molestias', 'excepturi', 'occaecati', 'cupiditate', 'similique'
  ];

  const generateWords = (wordCount: number): string => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = (): string => {
    const wordCount = Math.floor(Math.random() * 15) + 5; // 5-20 words
    const sentence = generateWords(wordCount);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generateText = () => {
    let result = '';

    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
      default:
        result = generateParagraph();
    }

    setGeneratedText(result);
  };

  React.useEffect(() => {
    generateText();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('loremGenerator.typeLabel')}</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="words">{t('loremGenerator.words')}</SelectItem>
              <SelectItem value="sentences">{t('loremGenerator.sentences')}</SelectItem>
              <SelectItem value="paragraphs">{t('loremGenerator.paragraphs')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('loremGenerator.countLabel')}</label>
          <Input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          />
        </div>
      </div>

      <Button onClick={generateText} className="w-full">
        {t('loremGenerator.generateBtn')}
      </Button>

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              {t('loremGenerator.generatedTitle')}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyWithToast(generatedText, t('common.copied'))}
              >
                {t('common.copy')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded border max-h-60 overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {generatedText}
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {generatedText.split(' ').length}{t('loremGenerator.statsSuffix')}{generatedText.length}{t('loremGenerator.statsSuffix2')}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-slate-600">
            <p><strong>{t('loremGenerator.aboutTitle')}</strong> {t('loremGenerator.about1')}</p>
            <p className="mt-2">{t('loremGenerator.about2')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoremGenerator;
